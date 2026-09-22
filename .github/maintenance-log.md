# Maintenance log

## 2026-09-22 — Document the browser experiment

### Rationale

The repository contained a complete static browser experiment but no README, setup instructions, description of the interaction, project map, or verification guidance. A maintainer had to infer the purpose and runtime requirements from the source.

### Files changed

- `README.md` — document the project's purpose, controls, implementation, limitations, file structure, development checks, and contribution expectations.
- `.gitignore` — ignore common operating-system metadata and local log files.
- `.github/maintenance-log.md` — record this maintenance work.

### Validation

- Ran `node --check script.js`.
- Verified every local file referenced by `index.html` exists.
- Confirmed the README's controls, numeric limits, remote audio dependency, and project structure against the source.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. This change adds documentation and ignore rules only; application behavior and deployed assets are unchanged.

### Rollback

Revert the pull request's squash commit to remove the documentation and ignore rules.
