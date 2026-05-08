# Known Issues & Code Quality Architecture

## 3. CODE QUALITY & ARCHITECTURE

### 🔴 CRITICAL God Components

**File:** `src/pages/AdvancedFENInputPage/AdvancedFENInputPage.jsx` (763 lines), `src/pages/settings/ThemeCustomization/ThemeCustomization.jsx` (680 lines), `src/pages/FENHistoryPage.jsx` (561 lines)
**Description:** These components are massive and handle data fetching, state management, and deeply nested UI rendering within a single file.
**Impact:** High cognitive load, difficulty in unit testing, and increased risk of merge conflicts and re-render cascading.
**Fix:** Extract local sub-components (e.g., the grid renderer in `ThemeCustomization`) into their own files. Delegate state management logic to custom hooks.

### 🟠 HIGH Unhandled Promise Rejections (Silent Failures)

**File:** `src/hooks/useFENHistory.js` (line 197)
**Description:** An asynchronous storage deletion method swallows errors: `await window.storage?.delete?.('fen-history').catch(() => {});`
**Impact:** If the cloud storage shim fails to delete the history, the application swallows the error without notifying the user or the logger.
**Fix:** Log the error correctly: `.catch(err => logger.error('Failed to delete history', err))`

### 🟡 MEDIUM Fast Refresh Warnings

**File:** `src/contexts/LayoutContext.jsx` (line 18)
**Description:** ESLint reports `Fast refresh only works when a file only exports components`.
**Impact:** Development experience is slightly degraded as React Fast Refresh may perform full reloads instead of HMR.
**Fix:** Move any exported constants or utility functions to a separate file (e.g., `src/constants/layoutConstants.js`).
