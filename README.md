# Salary Expense Tracker

A simple web app to track monthly expenses aligned with your **salary cycle** (credited by the 26th, or the previous working day if the 26th is a weekend/bank holiday).

## Features

- **Salary-based periods** — not calendar months; each cycle runs from salary date to the day before the next salary
- **Need · Wants · Investment** — three main buckets
- **Sector breakdown** — food, entertainment, transport, utilities, and more
- **Food split** — Need + Food = mess/daily groceries; Wants + Food = outings, dates, cafes
- **History** — browse past salary cycles with totals
- **MongoDB** — persistent storage (history, settings)
- **PWA-ready** — add to home screen on mobile

## Quick start (local)

### 1. MongoDB Atlas (free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user and allow network access (`0.0.0.0/0` for dev, or your IP)
3. Copy the connection string

### 2. Configure environment

```bash
cd expense-tracker
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/expense-tracker
DEFAULT_SALARY=50000
# Optional API protection:
# API_SECRET=your-random-secret
# NEXT_PUBLIC_API_SECRET=your-random-secret
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. First-time setup in app

1. Open **Settings** → set salary day (default **26**) and monthly salary
2. Add any extra bank holidays if your employer credits early
3. Start logging expenses under **Add**

## Deploy to Vercel (≈5 minutes)

1. Push to GitHub (see below)
2. Import the repo at [vercel.com/new](https://vercel.com/new) → connect [anirudhakale98](https://github.com/anirudhakale98)
3. Add environment variables in Vercel project settings:
   - `MONGODB_URI` (required)
   - `DEFAULT_SALARY` (optional)
   - `API_SECRET` + `NEXT_PUBLIC_API_SECRET` (optional, same value)
4. Deploy

### Push to GitHub

```bash
cd expense-tracker
gh auth login
gh repo create expense-tracker --public --source=. --remote=origin --push
```

Or create [expense-tracker](https://github.com/new) on GitHub, then:

```bash
git remote add origin https://github.com/anirudhakale98/expense-tracker.git
git push -u origin main
```

## Mobile

- Responsive layout with safe-area support (notch / home bar)
- Bottom navigation with 44px touch targets
- Add to Home Screen via browser menu (PWA manifest included)

## Google Calendar

This app uses built-in salary-date logic (26th + weekends + Indian bank holidays). **Google Calendar is not required** for expense tracking.

If you want calendar sync later, you can add a salary event in Google Calendar and manually match dates in Settings — full OAuth calendar integration can be added as a future enhancement.

## Project structure

```
src/
  app/           # Pages + API routes
  components/    # UI
  lib/           # Salary logic, categories, MongoDB
  models/        # Mongoose schemas
```

## Tech stack

- Next.js 16 (App Router)
- MongoDB + Mongoose
- Tailwind CSS
- date-fns
