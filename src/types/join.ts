export type ApplicantStatus = "Student" | "Alumnus" | "Other";

export type InterestArea =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Design/UX"
  | "Mobile"
  | "AI/ML"
  | "Cybersecurity"
  | "Not sure yet";

export type ExperienceLevel = "Beginner" | "Some projects" | "Comfortable";

export interface AvailabilityOption {
  value: string;
  label: string;
}

export interface JoinFormData {
  fullName: string;
  email: string;
  year: string;
  status: ApplicantStatus | null;
  github: string;
  linkedin: string;
  discord: string;
  interests: InterestArea[];
  experience: ExperienceLevel | null;
  availability: string | null;
  motivation: string;
  builtSomething: string;
  consent: boolean;
}
