import type {
  ExperienceLevel,
  InterestArea,
  JoinFormData,
  ParticipationPreference,
  ParticipationRating,
} from "@/types/join";

export const YEAR_OPTIONS = ["1st year", "2nd year", "3rd year", "4th year", "5th year+"];

export const INTEREST_AREAS: InterestArea[] = [
  "Web Development (Frontend/Backend)",
  "Mobile Development (iOS/Android)",
  "Data Science / Machine Learning / AI",
  "Embedded Systems / IoT Software",
  "Game Development",
  "Software Testing / Quality Assurance",
  "DevOps / Cloud Computing",
  "DSA",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [1, 2, 3, 4, 5];

export const PARTICIPATION_RATINGS: { value: ParticipationRating; label: string }[] = [
  { value: "none", label: "Not at all" },
  { value: "low", label: "A little" },
  { value: "medium", label: "Moderately" },
  { value: "high", label: "Very" },
];

export const PARTICIPATION_ROWS: { value: ParticipationPreference; label: string }[] = [
  { value: "regularMember", label: "Participate as a regular member" },
  { value: "eventOrganizer", label: "Help organize events" },
  { value: "workshopVolunteer", label: "Volunteer or present workshops" },
];

export const EMPTY_JOIN_FORM: JoinFormData = {
  fullName: "",
  email: "",
  year: YEAR_OPTIONS[0],
  github: "",
  linkedin: "",
  discord: "",
  interests: [],
  experience: null,
  participationPreferences: {
    regularMember: null,
    eventOrganizer: null,
    workshopVolunteer: null,
  },
  motivation: "",
  builtSomething: "",
  consent: false,
};

export const MAX_TEXTAREA_LENGTH = 300;
