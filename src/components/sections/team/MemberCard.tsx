// Prerequisite imports for the MemberCard component, including UI components and the Member interface.
import { Card } from "@/components/ui/card";
import { Member } from "./Member";

// The MemberCard component is a reusable UI component that displays information about a team member.
export default function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="w-full h-full p-6 rounded-2xl border border-border bg-card transition-transform transform hover:scale-105 hover:shadow-lg hover:border-primary/60">
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-6 items-stretch">
        <div className="flex flex-col items-center">
          <img
            src={member.image}
            alt={`${member.firstname} ${member.lastname}`}
            className="w-24 h-24 rounded-full object-cover mb-2 ring-1 ring-foreground/5"
          />
          <h2 className="text-lg font-semibold text-center">
            {member.firstname} {member.lastname}
          </h2>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-start gap-3">
              <span className="inline-block bg-secondary/10 text-secondary-foreground py-1 rounded-full text-xs">
                {member.role}
              </span>
            </div>
            <p className="mt-2 text-sm text-primary/70">{member.bio}</p>
          </div>

          <div className="flex gap-3 mt-4">
            {member.socialLinks.linkedIn && (
              <a
                href={member.socialLinks.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.firstname} ${member.lastname} on LinkedIn`}
                className="text-primary/80 hover:text-primary transform transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-14h4v2" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.firstname} ${member.lastname} on GitHub`}
                className="text-primary/80 hover:text-primary transform transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.08.79 2.18 0 1.58-.01 2.86-.01 3.25 0 .31.2.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {member.socialLinks.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.firstname} ${member.lastname} on Twitter`}
                className="text-primary/80 hover:text-primary transform transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.06 9.06 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2.28-4.5 5.08 0 .4.05.8.14 1.18C8.2 6.05 4.3 4.13 1.67 1.15c-.44.75-.7 1.62-.7 2.55 0 1.76.96 3.31 2.42 4.22A4.48 4.48 0 0 1 .9 7v.06c0 2.46 1.66 4.51 3.86 4.98-.4.1-.82.15-1.25.15-.3 0-.6-.03-.88-.09.6 2.08 2.38 3.6 4.48 3.64A9.07 9.07 0 0 1 0 19.54 12.8 12.8 0 0 0 6.92 21c8.3 0 12.84-7.2 12.84-13.44v-.61A9.2 9.2 0 0 0 23 3z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
