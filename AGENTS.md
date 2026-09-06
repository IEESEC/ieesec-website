<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Git workflow rules for agents

- Use Conventional Commits for every commit. Format: `type(scope): imperative summary`, using a valid type such as `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, or `build`.
- Use a matching conventional branch name, such as `feat/<short-description>`, `fix/<short-description>`, `perf/<short-description>`, or `chore/<short-description>`.
- Use a Conventional Commit style PR title with the same `type(scope): imperative summary` format. Keep the title concise and describe the shipped behavior.
- Before committing or pushing, review the staged file list and exclude generated agent artifacts, audit reports, screenshots, traces, logs, temporary files, and other outputs created only for verification. Do not push files such as `AUDIT.md` unless the user explicitly requests that artifact in the repository.
- Keep generated verification output ignored by Git where appropriate, and never stage ignored artifacts with `git add -f` without explicit user instruction.
