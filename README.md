# VotePoll — React Voting Poll App

A single-page voting poll app built with Vite + React and Tailwind CSS.

## Features

- Add custom poll options via a form
- Vote on any option (one vote per user session)
- Remove options before voting starts (× button disappears after first vote)
- Live vote counts and animated percentage progress bars
- Reset all votes back to zero
- Data persists across page refreshes via `localStorage`
- Fully responsive (mobile + desktop)
- Smooth animations powered by Framer Motion

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Project Structure

```
src/
├── App.jsx                # Root component — all state lives here
├── main.jsx               # Entry point
├── index.css              # Tailwind import
└── components/
    ├── PollForm.jsx        # Add-option form with shake + entrance animations
    ├── PollList.jsx        # Renders list of PollOption components (AnimatePresence)
    └── PollOption.jsx      # Individual option: vote/remove buttons + progress bar
```

## Setup & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/iankinoti-cloud/voting_poll_app.git
   cd voting_poll_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
npm run preview
```

## How It Works

| Action | What happens |
|--------|-------------|
| Type + click **Add Option** | New poll option appears with a spring animation |
| Click **×** on an option | Option is removed (only visible before voting) |
| Click **Vote** | Increments that option's count; all Vote buttons disable |
| Click **Reset Votes** | Clears all counts to zero; re-enables voting |
| Refresh the page | All options and vote state persist from `localStorage` |

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep black | `#0c0b0a` | Page background |
| Warm dark | `#1a1815` | Cards, header |
| Beige | `#c8b89a` | Buttons, progress bars, accents |
| Cream | `#f2ede4` | Primary text |

## Team


