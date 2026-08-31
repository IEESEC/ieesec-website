// Typescript interfaces define data structures and types for the members of the team section.
// This ensures type safety and better code maintainability when working with member data throughout the application.
export interface Member {
  id: "andreas" | "magda" | "dimitris";
  firstname: string; // The first name of the member.
  lastname: string; // The last name of the member.
  image: string; // The URL of the member's image.
  socialLinks: {
    linkedIn?: string; // The URL of the member's LinkedIn profile (optional).
    github?: string; // The URL of the member's GitHub profile (optional).
    twitter?: string; // The URL of the member's Twitter profile (optional).
  };
}

// A data array of members, each with their own information and social links.
// This can be used to dynamically render member cards in the team section of the website.
// You can add more members to this array as needed, following the same structure.
// TODO: Consider moving this data to a separate JSON file or fetching it from an API for better maintainability and scalability.
export const members: Member[] = [
  {
    id: "andreas",
    firstname: "Andreas",
    lastname: "Kapsalis",
    image: "https://avatars.githubusercontent.com/u/57574085?v=4",
    socialLinks: {
      linkedIn: "https://linkedin.com/in/andrkapsalis",
      github: "https://github.com/andreaskapsalhs",
    },
  },
  {
    id: "magda",
    firstname: "Magda (Madelyn)",
    lastname: "Efstathiadou",
    image: "/images/members/magda.jpg",
    socialLinks: {
      linkedIn: "https://www.linkedin.com/in/madelyn2025/",
      github: "https://github.com/thisIsMadelyn",
    },
  },
  {
    id: "dimitris",
    firstname: "Dimitris",
    lastname: "Tsakiridis",
    image: "/images/members/dtsakiridis.jpg",
    socialLinks: {
      linkedIn: "https://www.linkedin.com/in/dtsakiridis/",
      github: "https://github.com/dimitriostsakiridis",
    },
  },
];
