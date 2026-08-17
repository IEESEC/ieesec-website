// Typescript interfaces define data structures and types for the members of the team section.
// This ensures type safety and better code maintainability when working with member data throughout the application.
export interface Member {
  firstname: string; // The first name of the member.
  lastname: string; // The last name of the member.
  role: string; // The role of the member.
  image: string; // The URL of the member's image.
  bio: string; // A brief biography of the member.
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
    firstname: "Andreas",
    lastname: "Kapsalis",
    role: "Chair | Full-stack Developer",
    image: "https://avatars.githubusercontent.com/u/57574085?v=4",
    bio: "Studying at Information and Electronic Systems Engineering department of International Hellenic University. Actively experimenting with various technologies and software stacks.",
    socialLinks: {
      linkedIn: "https://linkedin.com/in/andrkapsalis",
      github: "https://github.com/andreaskapsalhs",
    },
  },
  {
    firstname: "Magda (Madelyn)",
    lastname: "Efstathiou",
    role: "Project Manager | Backend Developer",
    image: "/images/members/magda.jpg",
    bio:
      "I'm a second-year Information & Electronics Engineering student at IHU Thessaloniki, " +
      "focused on Java and Spring Boot backend development.",
    socialLinks: {
      linkedIn: "https://www.linkedin.com/in/madelyn2025/",
      github: "https://github.com/thisIsMadelyn",
    },
  },
  {
    firstname: "Dimitris",
    lastname: "Tsakiridis",
    role: "Project Manager | Full-stack Developer",
    image: "/images/members/dtsakiridis.jpg",
    bio:
      "I thrive where code meets circuitry. My work is a bold pursuit of elegant solutions, " +
      "grounded in a robust academic foundation in Computer Science and Electronics.",
    socialLinks: {
      linkedIn: "https://www.linkedin.com/in/dtsakiridis/",
      github: "https://github.com/dimitriostsakiridis",
    },
  },
];
