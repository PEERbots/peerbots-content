# Peerbots Marketplace

> Community content and activity sharing hub for the Peerbots ecosystem.

[![CI](https://github.com/PEERbots/peerbots-content/actions/workflows/ci.yml/badge.svg)](https://github.com/PEERbots/peerbots-content/actions/workflows/ci.yml)
[![Node Version](https://img.shields.io/badge/node-24.14.1-brightgreen.svg)](.nvmrc)
[![Peerbots Core](https://img.shields.io/badge/@peerbots/core-v1.0.1-blue.svg)](https://github.com/PEERbots/peerbots-core)

The **Peerbots Marketplace** ([market.peerbots.org](https://market.peerbots.org)) allows educators, therapists, parents, and creators to discover, share, rate, and clone custom robot face content, soundboards, and interaction templates.

---

## 🌐 Ecosystem Integration

Peerbots Marketplace is part of the coordinated Peerbots product family:

* **[Peerbots Home](https://peerbots.org)**: The informational home of Peerbots and open social robotics.
* **[Robot Controller](https://app.peerbots.org)** ([`peerbots-controller-web`](https://github.com/PEERbots/peerbots-controller-web)): The live web controller for puppeteering robot expressions, speech, sounds, and sequences.
* **[Peerbots Marketplace](https://market.peerbots.org)** (`peerbots-content`): Browse, search, and manage community content packages and activities.
* **[`@peerbots/core`](https://github.com/PEERbots/peerbots-core)**: Shared component library, brand typography (`Outfit`), Tailwind CSS v4 design tokens, and authentication UI.

### Two-Way Controller Handoff
Users browsing the marketplace can directly launch and test content packages inside the Robot Controller with one click:
```
https://app.peerbots.org/dash/control?importMarketplaceContent=<contentId>
```
For public and free content items, users can load activities immediately into the controller without requiring a separate sign-in or manual import step.

---

## 🚀 Tech Stack

* **UI Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/) with `@tailwindcss/vite`
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@peerbots/core/theme` design tokens
* **Design System**: [`@peerbots/core`](https://github.com/PEERbots/peerbots-core) (`Button`, `Dialog`, `Dropdown`, `SearchInput`, `Heading`, `Text`, `Card`, `AuthFormUI`, etc.)
* **Backend & Storage**: [Firebase](https://firebase.google.com/) (Cloud Firestore, Authentication, Firebase Storage, Firebase Hosting)
* **Routing**: [React Router v7](https://reactrouter.com/)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js `24.14.1` (see [`.nvmrc`](.nvmrc))
- npm `10+`

To switch to the recommended Node version:
```bash
nvm use
```

### Installation

```bash
npm install
```

### Development

Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

The app will start at `http://localhost:5173`. In development mode (`import.meta.env.DEV`), the app will automatically connect to local Firebase emulators on `localhost` (Auth: `9099`, Firestore: `8080`, Storage: `9199`) if running.

### Quality Checks & Build

```bash
# Type-check TypeScript codebase without emitting
npm run typecheck

# Lint with ESLint
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
peerbots-content/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Lint, typecheck, and build on push/PR
│       ├── firebase-hosting-merge.yml      # Continuous deployment on merge to main
│       └── firebase-hosting-pull-request.yml # Preview channel deployment on PR
├── src/
│   ├── assets/                             # Logos, branding images, illustrations
│   ├── components/                         # UI components
│   │   ├── authForm.tsx                    # Authentication powered by @peerbots/core
│   │   ├── contentCard.tsx                 # Marketplace item surface card
│   │   ├── contentRow.tsx                  # Horizontal scroll rows for collections
│   │   ├── footer.tsx                      # Ecosystem footer with social links
│   │   ├── navbar.tsx                      # Header with Marketplace branding & SearchInput
│   │   ├── RootLayout.tsx                  # Application shell and route container
│   │   ├── searchForm.tsx                  # Filter and query form
│   │   └── StarRating.tsx                  # Accessible 5-star rating widget
│   ├── pages/                              # Routed page views
│   │   ├── content/ContentPage.tsx         # Content detail, reviews, and "Open in App" CTA
│   │   ├── my/                             # User collections (My Content, Listings, Purchases)
│   │   ├── tag/TagPage.tsx                 # Category/tag content browser
│   │   ├── HomePage.tsx                    # Marketplace home with hero and featured rows
│   │   ├── ProfilePage.tsx                 # Creator profile page
│   │   ├── SearchResultsPage.tsx           # Search results with EmptyState
│   │   └── NotFoundPage.tsx                # 404 handler
│   ├── state/
│   │   └── AuthProvider.tsx                # React context for Firebase auth state
│   ├── types/                              # Shared TypeScript models (Content, User, etc.)
│   ├── firebase.ts                         # Firebase SDK initialization & emulators
│   ├── index.css                           # Tailwind v4 configuration + @peerbots/core theme
│   └── main.tsx                            # React entry point
├── firebase.json                           # Firebase Hosting and emulator ports
├── package.json                            # Package dependencies and scripts
└── tsconfig.json                           # TypeScript configuration
```

---

## 🔒 Security & Quality Assurance

- **Continuous Integration**: `.github/workflows/ci.yml` validates all pull requests and commits against ESLint rules, TypeScript strict compilation, and Vite production bundle builds.
- **Firebase Hosting Previews**: Every PR automatically builds a live Firebase preview channel for visual review.
- **Brand Cohesion**: All typography, colors, button styles, dialogs, and form elements follow the unified `@peerbots/core` token scale.

---

## 📄 License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
