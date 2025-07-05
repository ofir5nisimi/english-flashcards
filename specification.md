# English Flashcards Web App — Software Specification

## Overview

A web application to help users learn English vocabulary through emoji-based flashcards. The app supports local user profiles, progress tracking, word management, and multiple-choice quizzes. Built with TypeScript and Vite/React, optimized for all devices.

---

## Features

### 1. Local User Profiles
- Users can create and switch between local profiles (usernames only, no password or email).
- Unlimited number of profiles can be created.
- Each profile tracks its own progress, completed levels, and quiz results.
- All user data is stored locally in the browser (e.g., `localStorage` or `IndexedDB`).
- Users can reset progress or delete their profile at any time.

### 2. Flashcards
- Each card displays:
  - An emoji representing the word.
  - The Hebrew translation (displayed below the emoji, before flipping).
- On click/tap, the card flips to reveal:
  - The English word.
  - Automatic pronunciation via browser’s built-in Text-to-Speech (TTS) API.
  - Option to replay the pronunciation.

### 3. Levels & Word Management
- Levels structure:
  - Each level contains 10 words.
  - Higher levels include all previous level words, plus 10 new, more difficult words.
  - Users can select any unlocked level to study.
- Word list management interface:
  - Add, edit, or remove words (emoji, English word, Hebrew translation).
  - Assign words to levels and manage level difficulty.
  - Unlimited number of words can be added.

### 4. Quizzes & Progression
- After studying a level, users must pass a multiple-choice quiz to complete the level.
  - Each question shows an emoji and Hebrew word; user selects the correct English word from four options.
  - Show results and allow retry if failed.
- Track and display completion status for each level.
- Users can revisit and retake any completed level or quiz.

### 5. Flashcard UI/UX
- One card is displayed at a time.
- Card flips on click/tap.
- Responsive design for desktop, mobile, and tablet.
- Clean, intuitive interface (no dark mode required).
- Hebrew text is visible under the emoji before flipping.

### 6. Export / Import
- Users can export all local profiles, progress, and word lists as a downloadable file (e.g., JSON).
- Users can import exported files to restore or transfer data between devices.
- On import, users can choose to merge with or replace existing data.

### 7. Technology Stack
- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **State Management**: (Your choice: React Context, Redux, Zustand)
- **Local Storage**: `localStorage` or `IndexedDB`
- **TTS**: Browser’s built-in `SpeechSynthesis` API

---

## User Stories

### As a User:
- I can create a local profile (just a username) and switch between profiles.
- I can reset my progress or permanently delete my profile.
- I can select a level and study flashcards for that level.
- I see an emoji and the Hebrew word before flipping the card.
- I flip the card to see the English word and automatically hear its pronunciation.
- I can replay the pronunciation if needed.
- I can take a multiple-choice quiz after studying a level.
- I can view my completed levels and quiz scores.
- I can export/import all profiles, progress, and word lists.

### As a Word List Manager:
- I can add, edit, or delete words (emoji, English word, Hebrew translation).
- I can assign words to levels and adjust level difficulty.
- I can manage an unlimited number of words.

---

## Non-Functional Requirements

- **Responsive Design:** Works seamlessly on desktop, mobile, and tablet.
- **Accessibility:** Use semantic HTML, ARIA labels, and keyboard navigation.
- **Performance:** Fast loading times and smooth transitions.
- **Security:** All data is local; no external authentication or server storage.
