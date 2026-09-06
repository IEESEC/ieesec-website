import { createHash } from "node:crypto";
import type {
  ExperienceLevel,
  InterestArea,
  JoinFormData,
  ParticipationPreference,
  ParticipationRating,
  YearOption,
} from "@/types/join";
import {
  EXPERIENCE_LEVELS,
  INTEREST_AREAS,
  MAX_TEXTAREA_LENGTH,
  PARTICIPATION_RATINGS,
  PARTICIPATION_ROWS,
  YEAR_OPTIONS,
} from "@/components/sections/join/data";

const DISCORD_WEBHOOK_ENV = "DISCORD_JOIN_WEBHOOK_URL";
const MAX_PAYLOAD_BYTES = 16 * 1024;
const MAX_SHORT_TEXT_LENGTH = 160;
const REQUEST_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const REQUEST_RATE_LIMIT_MAX = 20;
const SUBMISSION_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const SUBMISSION_RATE_LIMIT_MAX = 4;
const APPLICANT_RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const APPLICANT_RATE_LIMIT_MAX = 2;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;
const DISCORD_WEBHOOK_PATTERN =
  /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w.-]+$/;

type ValidationResult =
  | { ok: true; data: JoinFormData }
  | { ok: false; reason: "invalid-json" | "invalid-payload" | "payload-too-large" };
type RateLimitBucket = {
  count: number;
  resetAt: number;
};
type RateLimitState = {
  buckets: Map<string, RateLimitBucket>;
  lastCleanupAt: number;
};

declare global {
  var joinApplicationRateLimitState: RateLimitState | undefined;
}

function getRateLimitState(): RateLimitState {
  if (!globalThis.joinApplicationRateLimitState) {
    globalThis.joinApplicationRateLimitState = {
      buckets: new Map(),
      lastCleanupAt: 0,
    };
  }

  return globalThis.joinApplicationRateLimitState;
}

function hashRateLimitKey(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function cleanupExpiredRateLimitBuckets(state: RateLimitState, now: number) {
  if (now - state.lastCleanupAt < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;

  for (const [key, bucket] of state.buckets) {
    if (bucket.resetAt <= now) state.buckets.delete(key);
  }

  state.lastCleanupAt = now;
}

function consumeRateLimit({
  scope,
  key,
  limit,
  windowMs,
}: {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
}): boolean {
  const now = Date.now();
  const state = getRateLimitState();

  cleanupExpiredRateLimitBuckets(state, now);

  const bucketKey = `${scope}:${hashRateLimitKey(key)}`;
  const currentBucket = state.buckets.get(bucketKey);

  if (!currentBucket || currentBucket.resetAt <= now) {
    state.buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (currentBucket.count >= limit) return false;

  currentBucket.count += 1;
  return true;
}

function getClientIdentifier(request: Request): string {
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return firstForwardedIp || "unknown-client";
}

function getApplicantIdentifier(form: JoinFormData): string {
  return [form.email, form.github, form.discord].map((value) => value.toLowerCase()).join("|");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBoundedString(
  value: unknown,
  maxLength: number,
  { required = false }: { required?: boolean } = {},
): string | null {
  if (typeof value !== "string") {
    if (!required && (value === undefined || value === null)) return "";
    return null;
  }

  const trimmed = value.trim();
  if (required && trimmed.length === 0) return null;
  if (trimmed.length > maxLength) return null;

  return trimmed;
}

function isOneOf<T extends string | number>(value: unknown, allowed: readonly T[]): value is T {
  return allowed.includes(value as T);
}

function normalizeInterests(value: unknown): InterestArea[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > INTEREST_AREAS.length) {
    return null;
  }

  const uniqueInterests = Array.from(new Set(value));

  if (!uniqueInterests.every((interest) => isOneOf(interest, INTEREST_AREAS))) return null;

  return uniqueInterests;
}

function normalizeParticipationPreferences(
  value: unknown,
): Record<ParticipationPreference, ParticipationRating | null> | null {
  if (!isRecord(value)) return null;

  const allowedRatings = PARTICIPATION_RATINGS;
  const preferences = {} as Record<ParticipationPreference, ParticipationRating | null>;

  for (const preference of PARTICIPATION_ROWS) {
    const rating = value[preference];

    if (!isOneOf(rating, allowedRatings)) return null;

    preferences[preference] = rating;
  }

  return preferences;
}

function validateJoinApplication(rawBody: string): ValidationResult {
  if (new TextEncoder().encode(rawBody).length > MAX_PAYLOAD_BYTES) {
    return { ok: false, reason: "payload-too-large" };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (!isRecord(parsed)) return { ok: false, reason: "invalid-payload" };

  const fullName = readBoundedString(parsed.fullName, MAX_SHORT_TEXT_LENGTH, { required: true });
  const email = readBoundedString(parsed.email, MAX_SHORT_TEXT_LENGTH, { required: true });
  const year = readBoundedString(parsed.year, MAX_SHORT_TEXT_LENGTH, { required: true });
  const github = readBoundedString(parsed.github, MAX_SHORT_TEXT_LENGTH, { required: true });
  const discord = readBoundedString(parsed.discord, MAX_SHORT_TEXT_LENGTH, { required: true });
  const linkedin = readBoundedString(parsed.linkedin, MAX_SHORT_TEXT_LENGTH);
  const motivation = readBoundedString(parsed.motivation, MAX_TEXTAREA_LENGTH);
  const builtSomething = readBoundedString(parsed.builtSomething, MAX_TEXTAREA_LENGTH);
  const interests = normalizeInterests(parsed.interests);
  const participationPreferences = normalizeParticipationPreferences(
    parsed.participationPreferences,
  );

  if (
    !fullName ||
    !email ||
    !EMAIL_PATTERN.test(email) ||
    !year ||
    !isOneOf(year, YEAR_OPTIONS) ||
    !github ||
    !discord ||
    !interests ||
    !isOneOf(parsed.experience, EXPERIENCE_LEVELS) ||
    !participationPreferences ||
    parsed.consent !== true
  ) {
    return { ok: false, reason: "invalid-payload" };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      year,
      github,
      linkedin: linkedin ?? "",
      discord,
      interests,
      experience: parsed.experience as ExperienceLevel,
      participationPreferences,
      motivation: motivation ?? "",
      builtSomething: builtSomething ?? "",
      consent: true,
    },
  };
}

function clipDiscordField(value: string, fallback = "Not provided"): string {
  const displayValue = value.trim() || fallback;

  return displayValue.length > 1024 ? `${displayValue.slice(0, 1020)}...` : displayValue;
}

const INTEREST_LABELS: Record<InterestArea, string> = {
  web: "🌐 Web Development",
  mobile: "📱 Mobile Development",
  dataAi: "🧠 Data Science / ML / AI",
  embedded: "🔌 Embedded Systems / IoT",
  games: "🎮 Game Development",
  testing: "🧪 Software Testing / QA",
  devops: "☁️ DevOps / Cloud Computing",
  dsa: "🧩 Data Structures & Algorithms",
};

const PARTICIPATION_LABELS: Record<ParticipationPreference, string> = {
  regularMember: "👥 Regular member",
  eventOrganizer: "🎟️ Event organization",
  workshopVolunteer: "🎤 Workshops / presenting",
};

const PARTICIPATION_RATING_LABELS: Record<ParticipationRating, string> = {
  none: "⚪ Not at all",
  low: "🟡 A little",
  medium: "🟠 Moderately",
  high: "🟢 Very",
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  1: "🌱 1 / 5 - Beginner",
  2: "🛠️ 2 / 5 - Learning the tools",
  3: "⚙️ 3 / 5 - Building steadily",
  4: "🚀 4 / 5 - Project-ready",
  5: "🏆 5 / 5 - Advanced",
};

const YEAR_LABELS: Record<YearOption, string> = {
  year1: "1st year",
  year2: "2nd year",
  year3: "3rd year",
  year4: "4th year",
  year5plus: "5th year+",
};

function formatParticipationPreferences(form: JoinFormData): string {
  return PARTICIPATION_ROWS.map((preference) => {
    const selectedValue = form.participationPreferences[preference];
    const preferenceLabel = PARTICIPATION_LABELS[preference];
    const ratingLabel =
      selectedValue === null ? "Not provided" : PARTICIPATION_RATING_LABELS[selectedValue];

    return `**${preferenceLabel}**\n${ratingLabel}`;
  }).join("\n");
}

function buildDiscordPayload(form: JoinFormData) {
  const interests = form.interests.map((interest) => INTEREST_LABELS[interest]).join("\n");

  return {
    username: "IEESEC Applications",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: "🚀 New IEESEC Join Application",
        description: "A new applicant wants to build, learn, and contribute with the team.",
        color: 0x508da4,
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: "👤 Applicant",
            value: clipDiscordField(
              `**Name:** ${form.fullName}\n**Email:** ${form.email}\n**Year:** ${YEAR_LABELS[form.year]}`,
            ),
            inline: true,
          },
          {
            name: "🔗 Profiles",
            value: clipDiscordField(
              [
                `**GitHub:** ${form.github}`,
                `**Discord:** ${form.discord}`,
                form.linkedin ? `**LinkedIn:** ${form.linkedin}` : "",
              ]
                .filter(Boolean)
                .join("\n"),
            ),
            inline: true,
          },
          {
            name: "🎯 Areas of Interest",
            value: clipDiscordField(interests),
          },
          {
            name: "📈 Programming Experience",
            value: form.experience === null ? "Not provided" : EXPERIENCE_LABELS[form.experience],
            inline: true,
          },
          {
            name: "🤝 Participation Preferences",
            value: clipDiscordField(formatParticipationPreferences(form)),
          },
          {
            name: "💡 Project or Initiative Idea",
            value: clipDiscordField(form.motivation),
          },
          {
            name: "🏗️ Projects They Are Proud Of",
            value: clipDiscordField(form.builtSomething),
          },
        ],
        footer: {
          text: "Submitted from the IEESEC website join form",
        },
      },
    ],
  };
}

function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return true;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

type JoinApplicationErrorCode =
  | "invalid-origin"
  | "unsupported-media-type"
  | "rate-limited"
  | "invalid-application"
  | "service-unavailable";

function jsonError(status: number, code: JoinApplicationErrorCode) {
  return Response.json({ ok: false, code }, { status });
}

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) return jsonError(403, "invalid-origin");

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return jsonError(415, "unsupported-media-type");
  }

  const clientIdentifier = getClientIdentifier(request);

  if (
    !consumeRateLimit({
      scope: "request",
      key: clientIdentifier,
      limit: REQUEST_RATE_LIMIT_MAX,
      windowMs: REQUEST_RATE_LIMIT_WINDOW_MS,
    })
  ) {
    return jsonError(429, "rate-limited");
  }

  const validation = validateJoinApplication(await request.text());

  if (!validation.ok) {
    return jsonError(validation.reason === "payload-too-large" ? 413 : 400, "invalid-application");
  }

  if (
    !consumeRateLimit({
      scope: "submission-ip",
      key: clientIdentifier,
      limit: SUBMISSION_RATE_LIMIT_MAX,
      windowMs: SUBMISSION_RATE_LIMIT_WINDOW_MS,
    }) ||
    !consumeRateLimit({
      scope: "submission-applicant",
      key: getApplicantIdentifier(validation.data),
      limit: APPLICANT_RATE_LIMIT_MAX,
      windowMs: APPLICANT_RATE_LIMIT_WINDOW_MS,
    })
  ) {
    return jsonError(429, "rate-limited");
  }

  const webhookUrl = process.env[DISCORD_WEBHOOK_ENV];

  if (!webhookUrl || !DISCORD_WEBHOOK_PATTERN.test(webhookUrl)) {
    return jsonError(500, "service-unavailable");
  }

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildDiscordPayload(validation.data)),
    });

    if (!discordResponse.ok) return jsonError(502, "service-unavailable");
  } catch {
    return jsonError(502, "service-unavailable");
  }

  return Response.json({ ok: true });
}
