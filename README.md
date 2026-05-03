---
title: CodeArena
emoji: ⚡
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# ⚡ CodeArena
### The Ultimate Gamified Dashboard for LeetCode Athletes.

**CodeArena** is a high-performance, minimalist platform designed to turn the grind of LeetCode into a competitive social experience. Track your mastery, visualize your progress with premium charts, and engage in "Battle Mode" challenges with your friends.

[**Live Demo**](https://krish2323-codearena.hf.space) | [**Report Bug**](https://github.com/Krish529-beep/codearena/issues)

---

## 💎 Overview
CodeArena is built for developers who want more than just a stats page. It’s a full-stack ecosystem designed for competition.

| Layer | Description |
| :--- | :--- |
| **Frontend** | React + Vite + Tailwind/Vanilla CSS. High-contrast Zinc/Black/White minimalist UI. |
| **Backend** | Express + MongoDB API. Real-time LeetCode syncing, snapshot-based challenges, and Socket.io integration. |
| **The Arena** | A proprietary "Battle Engine" that tracks solving progress from the moment a challenge starts. |

---

## ⚔️ The Arena: Challenge Mode
The heart of CodeArena is the **Competitive Group Challenge**. Unlike other trackers that show lifetime stats, CodeArena snapshots your starting point the moment a battle begins.

| Feature | How it Wins |
| :--- | :--- |
| **Snapshots** | Records your `initialSolvedCount` and `initialPoints` at the start of every challenge. |
| **Real-time Delta** | Displays `+X` progress so the leaderboard reflects current effort, not past glory. |
| **Admin Controls** | Group admins can set target goals (e.g., 50 problems) and set battle expiration dates. |
| **Progress Bars** | Visual feedback for every member tracking their journey to the target goal. |

---

## 🛠️ Core Functionalities
| Feature | Description |
| :--- | :--- |
| **Real-time Sync** | One-click sync with official LeetCode stats via custom scraping services. |
| **Mastery Charts** | Beautifully rendered donut charts showing Easy, Medium, and Hard distributions. |
| **Session Persistence** | Custom LocalStorage + JWT bridge to keep you logged in even inside Hugging Face iframes. |
| **Google Auth** | Seamless login using Google Identity Services with FedCM mobile compatibility. |
| **Social Groups** | Create or join private/public groups with unique invite codes. |

---

## 💻 Tech Stack
| Category | Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion, Lucide Icons, Axios |
| **Backend** | Node.js, Express, Socket.io, Mongoose, Zod |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, Google OAuth 2.0, HTTP-only Cookies |
| **Deployment** | Docker, Hugging Face Spaces |

---

## 🚀 Local Setup

### Prerequisites
* **Node.js** 20+
* **MongoDB** connection string
* **Google Client ID** (for OAuth)

### 1. Clone & Install
```bash
git clone https://github.com/Krish529-beep/codearena.git
cd codearena
```

### 2. Configure Environment
Create a `.env` in both `client` and `server` folders.

**Server `.env`:**
```env
MONGODB_URI=your_mongo_uri
JWT_ACCESS_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
CLIENT_URL=http://localhost:5173
```

**Client `.env`:**
```env
VITE_GOOGLE_CLIENT_ID=your_id
```

### 3. Run Development
```bash
# Terminal 1: Backend
cd server && npm install && npm run dev

# Terminal 2: Frontend
cd client && npm install && npm run dev
```

---

## 🎨 Design Philosophy
*   **Minimalism**: Zero bloat. High contrast. Focused on the data.
*   **Zinc Palette**: Deep blacks and zinc greys for a premium "developer" feel.
*   **Responsiveness**: Fully optimized for mobile battles on the go.

---

## 📝 Credits
Built with ⚡ by **Krish** and the CodeArena team. Designed for the athletes of LeetCode.

---
