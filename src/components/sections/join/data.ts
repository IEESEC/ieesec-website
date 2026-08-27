import type {
  ApplicantStatus,
  AvailabilityOption,
  ExperienceLevel,
  InterestArea,
  JoinFormData,
} from "@/types/join";

export const YEAR_OPTIONS = ["1st year", "2nd year", "3rd year", "4th year", "5th year+"];

export const STATUS_OPTIONS: ApplicantStatus[] = ["Student", "Alumnus"];

export const INTEREST_AREAS: InterestArea[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "Design/UX",
  "Not sure yet",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Beginner", "Some projects", "Comfortable"];

export const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  { value: "casual", label: "Casual (workshops now and then)" },
  { value: "active", label: "Active (a few hours a week)" },
  { value: "core", label: "Core team (I want to help run things)" },
];

export const EMPTY_JOIN_FORM: JoinFormData = {
  fullName: "",
  email: "",
  year: YEAR_OPTIONS[0],
  status: null,
  github: "",
  linkedin: "",
  discord: "",
  interests: [],
  experience: null,
  availability: null,
  motivation: "",
  builtSomething: "",
  consent: false,
};

export const MAX_TEXTAREA_LENGTH = 300;
