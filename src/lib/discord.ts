const DISCORD_INVITE_API_URL = "https://discord.com/api/v10/invites/2xHBsHMKy7?with_counts=true";

export type DiscordServerInfo = {
  memberCount: number | null;
  iconUrl: string | null;
};

export function parseDiscordMemberCount(payload: unknown): number | null {
  if (typeof payload !== "object" || payload === null) return null;

  const count = (payload as { approximate_member_count?: unknown }).approximate_member_count;
  return typeof count === "number" && Number.isSafeInteger(count) && count >= 0 ? count : null;
}

export function parseDiscordIconUrl(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;

  const guild = (payload as { guild?: unknown }).guild;
  if (typeof guild !== "object" || guild === null) return null;

  const id = (guild as { id?: unknown }).id;
  const icon = (guild as { icon?: unknown }).icon;
  if (
    typeof id !== "string" ||
    !/^\d+$/.test(id) ||
    typeof icon !== "string" ||
    !/^[\w-]+$/.test(icon)
  ) {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=128`;
}

export async function getDiscordServerInfo(): Promise<DiscordServerInfo> {
  try {
    const response = await fetch(DISCORD_INVITE_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) return { memberCount: null, iconUrl: null };

    const payload = await response.json();
    return {
      memberCount: parseDiscordMemberCount(payload),
      iconUrl: parseDiscordIconUrl(payload),
    };
  } catch {
    return { memberCount: null, iconUrl: null };
  }
}

export async function getDiscordMemberCount(): Promise<number | null> {
  return (await getDiscordServerInfo()).memberCount;
}
