# Maintenance log

## 2026-09-30 — Make the catapult slider keyboard accessible

### Rationale

The volume knob was implemented as a button with a label, but it did not expose a slider range or current value and ignored keyboard input. Keyboard and screen-reader users therefore could not operate the experiment's primary control.

### Files changed

- `index.html` — add slider semantics, a persistent keyboard-instruction description, and initial accessible values.
- `script.js` — synchronize accessible values and support standard slider keys without changing pointer catapult physics.
- `style.css` — add a visible keyboard-focus indicator, screen-reader-only utility, and reduced-motion handling for the shake effect.
- `test/accessibility.test.js` and `package.json` — add dependency-free accessibility regression checks.
- `README.md` — document keyboard usage and the new validation command.
- `.github/maintenance-log.md` — record this maintenance work.

### Validation

- Ran `npm test`.
- Ran `node --check script.js`.
- Verified HTML IDs referenced by ARIA attributes exist.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. Pointer, touch, audio, and catapult behavior are unchanged. The new direct adjustment path runs only for standard slider keys while the knob is focused.

### Rollback

Revert the pull request's squash commit to restore the pointer-only control and remove its regression tests.

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
