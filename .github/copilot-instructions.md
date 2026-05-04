# Git Commit Message Generation Rules

When generating commit messages, you MUST strictly follow the Conventional Commits specification. Analyze the staged changes carefully and choose the most appropriate type.

## 1. Allowed Commit Types

Do not use 'chore:' as a default fallback. Use the following types based on the actual code changes:

- **feat:** A new feature, functionality, or significant structural addition.
- **fix:** A bug fix, error resolution, or layout correction.
- **style:** Visual changes, UI/UX updates, CSS tweaks, animations, or code formatting (spaces, semicolons) that do not affect the core logic.
- **perf:** Code changes that improve performance (e.g., adding React.memo, optimizing rendering, fixing lag).
- **refactor:** Code changes that neither fix a bug nor add a feature, but improve code structure or logic.
- **docs:** Documentation changes (README, comments).
- **test:** Adding missing tests or correcting existing tests.
- **chore:** Strictly reserve this for updating build tasks, package manager configs (npm/yarn), or minor dependency bumps.

## 2. Scopes (Optional but Recommended)

If the change affects a specific component or page, include a scope in parentheses.
_Examples:_ `feat(theme-studio):`, `fix(navbar):`, `style(board):`, `perf(dnd):`

## 3. Formatting Rules

- **Imperative Mood:** Write the subject line in the imperative, present tense (e.g., use "add" instead of "added" or "adds", use "fix" instead of "fixed").
- **Case & Punctuation:** Do not capitalize the first letter of the subject line. Do not end the subject line with a period (.).
- **Length:** Keep the first line under 72 characters.
- **Body (Optional):** If the change is complex, provide a short body explaining _why_ the change was made, separated from the subject by a blank line.

## 4. Good Examples:

- style(home): update grid layout to 8 columns and add 100vh
- perf(editor): optimize drag and drop to prevent lag
- fix(responsive): resolve scrolling issue on mobile screens
- feat(advanced-fen): implement dynamic row expansion for input cards
