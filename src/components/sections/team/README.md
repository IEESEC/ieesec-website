# Team Section & MemberCard Component

## Overview

The `MemberCard` is a responsive UI component designed to display individual team members within the "Meet our Team" section. It features a responsive layout (stacking on mobile, horizontal on desktop) and includes interactive, dark-mode-optimized hover effects.

## Interface (Props)

The component accepts data based on the `Member` interface:

| Prop          | Type     | Required | Description                                                      |
| :------------ | :------- | :------- | :--------------------------------------------------------------- |
| `name`        | `string` | Yes      | The full name of the team member.                                |
| `role`        | `string` | Yes      | The member's primary job title or role.                          |
| `image`       | `string` | Yes      | URL for the avatar. If empty, falls back to a default SVG.       |
| `bio`         | `string` | Yes      | A short biography or description.                                |
| `socialLinks` | `Object` | Yes      | Contains optional links for `linkedIn`, `github`, and `twitter`. |

## Usage Example

```tsx
import MemberCard from "./MemberCard";

const mockMember = {
  name: "Andreas Kapsalis",
  role: "Chair | Full-stack Developer",
  image: "path/to/image.png",
  bio: "I'm a first-year Information and Electronic Systems Engineering student...",
  socialLinks: {
    linkedIn: "[https://linkedin.com/in/andreask](https://linkedin.com/in/andreask)",
    github: "[https://github.com/andreask](https://github.com/andreask)",
  },
};

export default function TeamSection() {
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-white mb-2">Meet our Team</h2>
      <p className="text-primary/70 mb-8">Engineering with purpose. Building as one.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MemberCard {...mockMember} />
      </div>
    </section>
  );
}
```
