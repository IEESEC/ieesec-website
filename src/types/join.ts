export type InterestArea =
  | "web"
  | "mobile"
  | "dataAi"
  | "embedded"
  | "games"
  | "testing"
  | "devops"
  | "dsa";

export type YearOption = "year1" | "year2" | "year3" | "year4" | "year5plus";

export type ExperienceLevel = 1 | 2 | 3 | 4 | 5;

export type ParticipationPreference = "regularMember" | "eventOrganizer" | "workshopVolunteer";

export type ParticipationRating = "none" | "low" | "medium" | "high";

export type ParticipationPreferences = Record<ParticipationPreference, ParticipationRating | null>;

export interface JoinFormData {
  fullName: string;
  email: string;
  year: YearOption;
  github: string;
  linkedin: string;
  discord: string;
  interests: InterestArea[];
  experience: ExperienceLevel | null;
  participationPreferences: ParticipationPreferences;
  motivation: string;
  builtSomething: string;
  consent: boolean;
}
