export type DemoRole = "ADMIN" | "PROJECT_MANAGER" | "CONTENT_EDITOR" | "CONTENT_REVIEWER";

export type DemoScenario =
  | "default"
  | "empty-projects"
  | "empty-posts"
  | "loading"
  | "recoverable-error"
  | "long-greek-copy"
  | "incomplete-translations"
  | "editor-conflict";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED";
export type PostStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";
export type TranslationStatus = "MISSING" | "INCOMPLETE" | "READY";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  roles: DemoRole[];
}

export interface Project {
  id: string;
  code: string;
  status: ProjectStatus;
  titleEl: string;
  titleEn: string;
  summaryEl: string;
  summaryEn: string;
  memberIds: string[];
  progress: number;
  repositoryUrl: string;
  startDate: string;
  targetDate: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  status: PostStatus;
  authorId: string;
  reviewerId: string | null;
  titleEl: string;
  titleEn: string;
  slugEl: string;
  slugEn: string;
  excerptEl: string;
  excerptEn: string;
  bodyEl: string;
  bodyEn: string;
  tags: string[];
  heroMediaId: string | null;
  publishedAt: string | null;
  scheduledFor: string | null;
  updatedAt: string;
}

export interface HomepagePlacement {
  id: string;
  sectionKey: "hero" | "featured-posts" | "active-projects" | "upcoming-events";
  contentType: "post" | "project" | "event";
  contentId: string;
  locale: "el" | "en";
  order: number;
  visible: boolean;
}

export interface MediaAsset {
  id: string;
  filename: string;
  type: "image" | "video";
  width: number;
  height: number;
  size: number;
  altEl: string;
  altEn: string;
  url: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  subject: string;
  occurredAt: string;
}

export interface DeadlineItem {
  id: string;
  label: string;
  context: string;
  dueAt: string;
  tone: "calm" | "attention" | "urgent";
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProjectsRepository {
  list(): Promise<Paginated<Project>>;
  getById(id: string): Promise<Project | null>;
  createDraft(): Promise<Project>;
}

export interface PostsRepository {
  list(): Promise<Paginated<Post>>;
  getById(id: string): Promise<Post | null>;
  createDraft(): Promise<Post>;
}

export interface HomepageRepository {
  list(): Promise<HomepagePlacement[]>;
}

export interface MediaRepository {
  list(): Promise<Paginated<MediaAsset>>;
}

export interface MembersRepository {
  list(): Promise<User[]>;
}

export interface DashboardData {
  metrics: {
    activeProjects: number;
    reviewQueue: number;
    upcomingDeadlines: number;
    assetsMissingAlt: number;
  };
  activeProjects: Project[];
  reviewQueue: Post[];
  deadlines: DeadlineItem[];
  activity: ActivityItem[];
  deliveryRhythm: {
    label: string;
    updates: number;
    reviews: number;
  }[];
  contributors: Pick<User, "id" | "name" | "initials">[];
}

export type DashboardSnapshot =
  | { state: "ready"; data: DashboardData }
  | { state: "loading" }
  | { state: "error"; message: string };
