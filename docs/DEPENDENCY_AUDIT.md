# Dependency Audit

## 7. DEPENDENCY AUDITz

Below is the exhaustive audit of all dependencies based on the `pnpm outdated` and `pnpm audit` execution.

### Security Vulnerabilities (CVEs)

- **Status:** 🟢 **0 Known Vulnerabilities**
- `pnpm audit` returned a clean state with no current CVEs across both dependencies and devDependencies.

### Outdated Packages

| Severity  | Package                           | Current Version | Latest Version | Type | Recommendation                                                  |
| :-------- | :-------------------------------- | :-------------- | :------------- | :--- | :-------------------------------------------------------------- |
| 🟢 LOW    | `tailwindcss`                     | 4.2.4           | 4.2.4          | dev  | Upgraded to v4. Using `@tailwindcss/postcss` for compatibility. |
| 🟢 LOW    | `vite`                            | 8.0.11          | 8.0.11         | dev  | Upgraded to latest stable version. Build verified.              |
| 🟢 LOW    | `react`                           | 19.2.6          | 19.2.6         | prod | Upgraded to latest patch.                                       |
| 🟢 LOW    | `react-dom`                       | 19.2.6          | 19.2.6         | prod | Upgraded to latest patch.                                       |
| 🟢 LOW    | `react-router-dom`                | 7.15.0          | 7.15.0         | prod | Upgraded to latest minor version.                               |
| 🟡 MEDIUM | `@eslint/js`                      | 9.39.4          | 10.0.1         | dev  | Kept at v9.x. v10 is incompatible with `eslint-plugin-react`.   |
| 🟡 MEDIUM | `eslint`                          | 9.39.4          | 10.3.0         | dev  | Kept at v9.x for plugin compatibility.                          |
| 🟢 LOW    | `lint-staged`                     | 17.0.2          | 17.0.2         | dev  | Upgraded to latest major version.                               |
| 🟢 LOW    | `@vitejs/plugin-react`            | 6.0.1           | 6.0.1          | dev  | Upgraded to latest major version.                               |
| 🟢 LOW    | `postcss`                         | 8.5.14          | 8.5.14         | dev  | Upgraded to latest patch.                                       |
| 🟢 LOW    | `@commitlint/config-conventional` | 20.5.3          | 20.5.3         | dev  | Upgraded to latest patch.                                       |

### Build & Configuration Review (8)

- **Vite Config:** Highly optimized. Source maps are disabled in production, chunk splitting is manual and granular, assets under 4KB are inline, and CSS code splitting is active.
- **Vercel Config:** `vercel.json` provides excellent security headers including strict `Permissions-Policy`, `XSS-Protection`, and `CSP`.
- **ESLint:** Strict configuration (failing CI on warnings via `--max-warnings=0`), avoiding common pitfalls.
