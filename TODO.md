# Implementation TODO List

## Phase 1: Project Setup & Core Architecture

- [x] **Initialize Vite + React + TypeScript project**  
  **Acceptance Criteria:** Project runs locally, shows a basic homepage, and uses TypeScript.

- [x] **Set up state management solution** (e.g., Context, Zustand, Redux)  
  **Acceptance Criteria:** Global state is accessible and modifiable from any component.

- [x] **Configure responsive base layout**  
  **Acceptance Criteria:** Layout adapts to desktop, tablet, and mobile; no content overflows.

---

## Phase 2: Local User Profiles

- [x] **Create local user profile management (add, switch, delete users)**  
  **Acceptance Criteria:**  
  - User can create a profile by entering a username.
  - User can switch between profiles.
  - User can delete a profile.
  - All data persists across page reloads via LocalStorage or IndexedDB.

- [x] **Add user progress tracking (per profile)**  
  **Acceptance Criteria:**  
  - Progress is tracked separately for each user.
  - Switching users updates the app to show the correct progress.

- [x] **Add option to reset user progress**  
  **Acceptance Criteria:**  
  - User can reset their progress for any profile.
  - Reset clears completed levels and quiz results for that profile.

---

## Phase 3: Flashcard System

- [x] **Display a single flashcard with emoji and Hebrew translation**  
  **Acceptance Criteria:**  
  - Flashcard shows emoji and Hebrew under it.
  - Only one card visible at a time.

- [x] **Implement card flip on click/tap**  
  **Acceptance Criteria:**  
  - Card flips smoothly on click/tap.
  - After flipping, English word is shown.

- [x] **Integrate browser Text-to-Speech for English word**  
  **Acceptance Criteria:**  
  - On flip, English word is pronounced automatically.
  - Button allows replaying pronunciation.

---

## Phase 4: Word List & Level Management

- [x] **Implement word list management UI**  
  **Acceptance Criteria:**  
  - User can add, edit, or delete words (emoji, English, Hebrew).
  - User can assign words to levels.
  - Unlimited words can be managed.

- [x] **Implement level structure logic**  
  **Acceptance Criteria:**  
  - Each level contains 10 words.
  - Higher levels include all lower level words plus 10 new words.
  - User can select any unlocked level.

---

## Phase 5: Quizzes & Progression

- [x] **Create multiple-choice quiz for each level**  
  **Acceptance Criteria:**  
  - Each quiz question shows emoji + Hebrew.
  - Four English word options are presented; only one is correct.
  - Quiz covers all words in the selected level.

- [x] **Show quiz results and allow retry if failed**  
  **Acceptance Criteria:**  
  - Quiz summary is displayed after completion.
  - User can retake the quiz if not passed.

- [x] **Track and display completion status per level**  
  **Acceptance Criteria:**  
  - Completed levels are clearly indicated in the UI.
  - Users can revisit and retake any level or quiz.

---

## Phase 6: Export / Import

- [ ] **Implement export of all data as JSON file**  
  **Acceptance Criteria:**  
  - User can download a file containing all profiles, progress, and word lists.

- [ ] **Implement import of data from JSON file**  
  **Acceptance Criteria:**  
  - User can select a file to import.
  - User can choose to merge or replace existing data.
  - All imported data is immediately usable.

---

## Phase 7: Polish & Accessibility

- [ ] **Ensure accessibility (semantic HTML, ARIA, keyboard navigation)**  
  **Acceptance Criteria:**  
  - App can be fully navigated by keyboard.
  - Appropriate ARIA labels and semantic tags are used.
  - Screen readers can interpret all UI elements.

- [ ] **Performance optimizations**  
  **Acceptance Criteria:**  
  - App loads quickly and transitions are smooth on all devices.


