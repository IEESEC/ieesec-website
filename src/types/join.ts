export type InterestArea =
  | "Web Development (Frontend/Backend)"
  | "Mobile Development (iOS/Android)"
  | "Data Science / Machine Learning / AI"
  | "Embedded Systems / IoT Software"
  | "Game Development"
  | "Software Testing / Quality Assurance"
  | "DevOps / Cloud Computing"
  | "DSA";

export type ExperienceLevel = 1 | 2 | 3 | 4 | 5;

export type ParticipationPreference = "regularMember" | "eventOrganizer" | "workshopVolunteer";

export type ParticipationRating = "none" | "low" | "medium" | "high";

export type ParticipationPreferences = Record<ParticipationPreference, ParticipationRating | null>;

export interface JoinFormData {
  fullName: string;
  email: string;
  year: string;
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
