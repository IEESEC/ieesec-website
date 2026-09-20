import type {
  ActivityItem,
  DashboardSnapshot,
  DeadlineItem,
  HomepagePlacement,
  HomepageRepository,
  MediaAsset,
  MediaRepository,
  MembersRepository,
  Post,
  PostsRepository,
  Project,
  ProjectsRepository,
  User,
  DemoScenario,
} from "@/features/admin/types";
import { getPostTranslationStatus } from "@/features/content/posts/translation-status";

const members: User[] = [
  {
    id: "user-admin",
    name: "Alex Papadopoulos",
    email: "alex@example.invalid",
    initials: "AP",
    roles: ["ADMIN"],
  },
  {
    id: "user-editor",
    name: "Eleni Kosta",
    email: "eleni@example.invalid",
    initials: "EK",
    roles: ["CONTENT_EDITOR"],
  },
  {
    id: "user-reviewer",
    name: "Nikos Markou",
    email: "nikos@example.invalid",
    initials: "NM",
    roles: ["CONTENT_REVIEWER"],
  },
  {
    id: "user-manager",
    name: "Maria Theodorou",
    email: "maria@example.invalid",
    initials: "MT",
    roles: ["PROJECT_MANAGER"],
  },
  {
    id: "user-member",
    name: "Giorgos Liapis",
    email: "giorgos@example.invalid",
    initials: "GL",
    roles: ["CONTENT_EDITOR", "PROJECT_MANAGER"],
  },
];

const projects: Project[] = [
  {
    id: "project-atlas",
    code: "ATLAS",
    status: "ACTIVE",
    titleEl: "Ψηφιακός οδηγός πανεπιστημιούπολης",
    titleEn: "Campus digital guide",
    summaryEl: "Ενοποιημένη εμπειρία προσανατολισμού για νέους φοιτητές.",
    summaryEn: "A unified orientation experience for new students.",
    memberIds: ["user-admin", "user-editor"],
    progress: 74,
    repositoryUrl: "https://github.com/IEESEC/project-atlas",
    startDate: "2026-06-15",
    targetDate: "2026-10-04",
    updatedAt: "2026-09-16T12:10:00.000Z",
  },
  {
    id: "project-orbit",
    code: "ORBIT",
    status: "ACTIVE",
    titleEl: "Πλατφόρμα συνεργασίας ομάδων",
    titleEn: "Team collaboration platform",
    summaryEl: "Εργαλεία για τα project groups και τους mentors της κοινότητας.",
    summaryEn: "Tools for community project groups and mentors.",
    memberIds: ["user-admin", "user-reviewer"],
    progress: 51,
    repositoryUrl: "https://github.com/IEESEC/project-orbit",
    startDate: "2026-07-01",
    targetDate: "2026-10-18",
    updatedAt: "2026-09-15T15:40:00.000Z",
  },
  {
    id: "project-pulse",
    code: "PULSE",
    status: "ACTIVE",
    titleEl: "Παρακολούθηση community events",
    titleEn: "Community events tracker",
    summaryEl: "Απλή ροή οργάνωσης και ενημέρωσης των επόμενων δράσεων.",
    summaryEn: "A lightweight flow for organizing and sharing upcoming activities.",
    memberIds: ["user-editor"],
    progress: 32,
    repositoryUrl: "https://github.com/IEESEC/project-pulse",
    startDate: "2026-08-20",
    targetDate: "2026-11-08",
    updatedAt: "2026-09-14T10:05:00.000Z",
  },
  {
    id: "project-spark",
    code: "SPARK",
    status: "PLANNING",
    titleEl: "Εργαλειοθήκη για φοιτητικά workshops",
    titleEn: "Student workshop toolkit",
    summaryEl: "Επαναχρησιμοποιήσιμο υλικό για hands-on τεχνικά sessions.",
    summaryEn: "Reusable material for hands-on technical sessions.",
    memberIds: ["user-manager", "user-member"],
    progress: 18,
    repositoryUrl: "https://github.com/IEESEC/project-spark",
    startDate: "2026-09-28",
    targetDate: "2026-12-12",
    updatedAt: "2026-09-13T11:20:00.000Z",
  },
  {
    id: "project-legacy",
    code: "LEGACY",
    status: "PAUSED",
    titleEl: "Αρχείο δράσεων κοινότητας",
    titleEn: "Community activity archive",
    summaryEl: "Οργάνωση ιστορικού υλικού και παλαιότερων παραδόσεων.",
    summaryEn: "Organising historic material and previous community deliveries.",
    memberIds: ["user-admin"],
    progress: 63,
    repositoryUrl: "https://github.com/IEESEC/project-legacy",
    startDate: "2026-03-10",
    targetDate: "2026-11-30",
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
];

const posts: Post[] = [
  {
    id: "post-teamwork",
    status: "IN_REVIEW",
    authorId: "user-editor",
    reviewerId: "user-reviewer",
    titleEl: "Χτίζοντας λογισμικό ως ομάδα",
    titleEn: "Building software as a team",
    slugEl: "xtizontas-logismiko-os-omada",
    slugEn: "building-software-as-a-team",
    excerptEl: "Πρακτικές που βοηθούν μια φοιτητική ομάδα να παραδίδει με συνέπεια.",
    excerptEn: "Practices that help a student team deliver consistently.",
    bodyEl: "Ενδεικτικό περιεχόμενο άρθρου.",
    bodyEn: "Representative article content.",
    tags: ["community", "engineering"],
    heroMediaId: "media-workshop",
    publishedAt: null,
    scheduledFor: null,
    updatedAt: "2026-09-16T09:25:00.000Z",
  },
  {
    id: "post-open-source",
    status: "IN_REVIEW",
    authorId: "user-editor",
    reviewerId: null,
    titleEl: "Το πρώτο σου open-source contribution",
    titleEn: "Your first open-source contribution",
    slugEl: "proto-open-source-contribution",
    slugEn: "first-open-source-contribution",
    excerptEl: "Από το issue μέχρι το pull request.",
    excerptEn: "From issue to pull request.",
    bodyEl: "Ενδεικτικό περιεχόμενο άρθρου.",
    bodyEn: "Representative article content.",
    tags: ["open-source"],
    heroMediaId: null,
    publishedAt: null,
    scheduledFor: null,
    updatedAt: "2026-09-15T13:10:00.000Z",
  },
  {
    id: "post-workshop",
    status: "DRAFT",
    authorId: "user-editor",
    reviewerId: null,
    titleEl: "Workshop: σχεδιάζοντας προσβάσιμα interfaces",
    titleEn: "Workshop: designing accessible interfaces",
    slugEl: "workshop-prosvasima-interfaces",
    slugEn: "workshop-accessible-interfaces",
    excerptEl: "",
    excerptEn: "Hands-on notes from our accessibility workshop.",
    bodyEl: "",
    bodyEn: "Representative article content.",
    tags: ["accessibility", "workshop"],
    heroMediaId: "media-workshop",
    publishedAt: null,
    scheduledFor: null,
    updatedAt: "2026-09-14T16:45:00.000Z",
  },
];

const placements: HomepagePlacement[] = [
  {
    id: "placement-hero-el",
    sectionKey: "hero",
    contentType: "project",
    contentId: "project-atlas",
    locale: "el",
    order: 1,
    visible: true,
  },
  {
    id: "placement-hero-en",
    sectionKey: "hero",
    contentType: "project",
    contentId: "project-orbit",
    locale: "en",
    order: 1,
    visible: true,
  },
  {
    id: "placement-1",
    sectionKey: "active-projects",
    contentType: "project",
    contentId: "project-atlas",
    locale: "el",
    order: 1,
    visible: true,
  },
  {
    id: "placement-post-el",
    sectionKey: "featured-posts",
    contentType: "post",
    contentId: "post-teamwork",
    locale: "el",
    order: 1,
    visible: true,
  },
  {
    id: "placement-post-en",
    sectionKey: "featured-posts",
    contentType: "post",
    contentId: "post-open-source",
    locale: "en",
    order: 1,
    visible: true,
  },
  {
    id: "placement-event-el",
    sectionKey: "upcoming-events",
    contentType: "event",
    contentId: "event-autumn-meetup",
    locale: "el",
    order: 1,
    visible: false,
  },
];

const media: MediaAsset[] = [
  {
    id: "media-workshop",
    filename: "accessibility-workshop.jpg",
    type: "image",
    width: 1600,
    height: 900,
    size: 248000,
    altEl: "",
    altEn: "Students collaborating during an accessibility workshop",
    url: "/images/hero/campus2.jpg",
  },
  {
    id: "media-campus",
    filename: "campus-community.jpg",
    type: "image",
    width: 1600,
    height: 900,
    size: 232000,
    altEl: "Μέλη της κοινότητας στην πανεπιστημιούπολη",
    altEn: "Community members on campus",
    url: "/images/hero/campus3.jpg",
  },
  {
    id: "media-community",
    filename: "community-meetup.jpg",
    type: "image",
    width: 1600,
    height: 900,
    size: 226000,
    altEl: "Συνάντηση της φοιτητικής κοινότητας IEESEC",
    altEn: "IEESEC student community meetup",
    url: "/images/hero/campus1.jpg",
  },
  {
    id: "media-og",
    filename: "ieesec-social-cover.png",
    type: "image",
    width: 1200,
    height: 630,
    size: 188000,
    altEl: "Κεντρικό γραφικό της IEESEC",
    altEn: "IEESEC primary social graphic",
    url: "/images/metadata/og-image.png",
  },
  {
    id: "media-join-poster",
    filename: "join-video-poster.jpg",
    type: "video",
    width: 1920,
    height: 1080,
    size: 412000,
    altEl: "Άποψη της πανεπιστημιούπολης για τη σελίδα εγγραφής",
    altEn: "Campus view for the join page",
    url: "/images/join/join-scroll-poster.jpg",
  },
];

const deadlines: DeadlineItem[] = [
  {
    id: "deadline-atlas",
    label: "Atlas beta review",
    context: "Project milestone",
    dueAt: "2026-09-19T12:00:00.000Z",
    tone: "urgent",
  },
  {
    id: "deadline-post",
    label: "Open-source article",
    context: "Editorial review",
    dueAt: "2026-09-22T15:00:00.000Z",
    tone: "attention",
  },
  {
    id: "deadline-orbit",
    label: "Orbit sprint planning",
    context: "Team session",
    dueAt: "2026-09-25T16:30:00.000Z",
    tone: "calm",
  },
];

const activity: ActivityItem[] = [
  {
    id: "activity-1",
    actor: "Eleni",
    action: "submitted for review",
    subject: "Building software as a team",
    occurredAt: "2026-09-16T09:25:00.000Z",
  },
  {
    id: "activity-2",
    actor: "Alex",
    action: "updated progress",
    subject: "ATLAS · 74%",
    occurredAt: "2026-09-16T08:10:00.000Z",
  },
  {
    id: "activity-3",
    actor: "Nikos",
    action: "requested translation changes",
    subject: "Accessibility workshop",
    occurredAt: "2026-09-15T17:35:00.000Z",
  },
];

async function demoLatency() {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 90));
  }
}

function paginate<T>(items: T[]) {
  return { items: structuredClone(items), total: items.length, page: 1, pageSize: 20 };
}

export const projectsRepository: ProjectsRepository = {
  async list() {
    await demoLatency();
    return paginate(projects);
  },
  async getById(id) {
    await demoLatency();
    return structuredClone(projects.find((project) => project.id === id) ?? null);
  },
  async createDraft() {
    await demoLatency();
    return {
      id: "project-new",
      code: "NEW",
      status: "PLANNING",
      titleEl: "",
      titleEn: "",
      summaryEl: "",
      summaryEn: "",
      memberIds: [],
      progress: 0,
      repositoryUrl: "",
      startDate: "2026-09-17",
      targetDate: "2026-12-15",
      updatedAt: "2026-09-17T08:00:00.000Z",
    };
  },
};

export const postsRepository: PostsRepository = {
  async list() {
    await demoLatency();
    return paginate(posts);
  },
  async getById(id) {
    await demoLatency();
    return structuredClone(posts.find((post) => post.id === id) ?? null);
  },
  async createDraft() {
    await demoLatency();
    return {
      id: "post-new",
      status: "DRAFT",
      authorId: "user-editor",
      reviewerId: null,
      titleEl: "",
      titleEn: "",
      slugEl: "",
      slugEn: "",
      excerptEl: "",
      excerptEn: "",
      bodyEl: "",
      bodyEn: "",
      tags: [],
      heroMediaId: null,
      publishedAt: null,
      scheduledFor: null,
      updatedAt: "2026-09-17T08:00:00.000Z",
    };
  },
};

export const homepageRepository: HomepageRepository = {
  async list() {
    await demoLatency();
    return structuredClone(placements);
  },
};

export const mediaRepository: MediaRepository = {
  async list() {
    await demoLatency();
    return paginate(media);
  },
};

export const membersRepository: MembersRepository = {
  async list() {
    await demoLatency();
    return structuredClone(members);
  },
};

export async function getDashboardSnapshot(scenario: DemoScenario): Promise<DashboardSnapshot> {
  if (scenario === "loading") return { state: "loading" };
  if (scenario === "recoverable-error") {
    return {
      state: "error",
      message: "The demo workspace could not be loaded. Your mock data is unchanged.",
    };
  }

  const [projectPage, postPage, mediaPage] = await Promise.all([
    projectsRepository.list(),
    postsRepository.list(),
    mediaRepository.list(),
  ]);
  let visibleProjects = scenario === "empty-projects" ? [] : projectPage.items;
  let visiblePosts = scenario === "empty-posts" ? [] : postPage.items;

  if (scenario === "long-greek-copy" && visibleProjects[0]) {
    visibleProjects = [
      {
        ...visibleProjects[0],
        titleEl:
          "Σχεδιασμός και υλοποίηση μιας ολοκληρωμένης ψηφιακής εμπειρίας προσανατολισμού για ολόκληρη την πανεπιστημιακή κοινότητα",
      },
      ...visibleProjects.slice(1),
    ];
  }

  if (scenario === "incomplete-translations" && visiblePosts[0]) {
    visiblePosts = [{ ...visiblePosts[0], titleEn: "", bodyEn: "" }, ...visiblePosts.slice(1)];
  }

  const activeProjects = visibleProjects.filter((project) => project.status === "ACTIVE");
  const reviewQueue = visiblePosts.filter((post) => post.status === "IN_REVIEW");

  return {
    state: "ready",
    data: {
      metrics: {
        activeProjects: activeProjects.length,
        reviewQueue: reviewQueue.length,
        upcomingDeadlines: deadlines.length,
        assetsMissingAlt: mediaPage.items.filter((asset) => !asset.altEl || !asset.altEn).length,
      },
      activeProjects,
      reviewQueue: reviewQueue.sort((a, b) =>
        getPostTranslationStatus(a).localeCompare(getPostTranslationStatus(b)),
      ),
      deadlines: structuredClone(deadlines),
      activity: structuredClone(activity),
      deliveryRhythm: [
        { label: "Mon", updates: 4, reviews: 2 },
        { label: "Tue", updates: 7, reviews: 3 },
        { label: "Wed", updates: 5, reviews: 4 },
        { label: "Thu", updates: 9, reviews: 5 },
        { label: "Fri", updates: 8, reviews: 6 },
        { label: "Sat", updates: 3, reviews: 2 },
        { label: "Sun", updates: 6, reviews: 4 },
      ],
      contributors: members.map(({ id, name, initials }) => ({ id, name, initials })),
    },
  };
}
