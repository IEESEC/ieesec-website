import type {
  ExperienceLevel,
  InterestArea,
  JoinFormData,
  ParticipationPreference,
  ParticipationRating,
} from "@/types/join";

export const YEAR_OPTIONS = ["year1", "year2", "year3", "year4", "year5plus"] as const;

export const INTEREST_AREAS: InterestArea[] = [
  "web",
  "mobile",
  "dataAi",
  "embedded",
  "games",
  "testing",
  "devops",
  "dsa",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [1, 2, 3, 4, 5];

export const PARTICIPATION_RATINGS: ParticipationRating[] = ["none", "low", "medium", "high"];

export const PARTICIPATION_ROWS: ParticipationPreference[] = [
  "regularMember",
  "eventOrganizer",
  "workshopVolunteer",
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
