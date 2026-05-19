# ⚽ GambleIt — AI Football Predictions & Parlay Optimizer

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange?style=for-the-badge&logo=googlegemini)](https://aistudio.google.com/)
[![API](https://img.shields.io/badge/Football_Data-API_v4-emerald?style=for-the-badge)](https://www.football-data.org/)

GambleIt is an advanced, AI-powered football prediction and betting-slip optimization dashboard that marries next-gen data science with real-time sports analytics. By utilizing **Google Gemini 1.5 Flash** for deep qualitative and tactical analysis, paired with real-time data from **football-data.org**, GambleIt delivers a premium, stats-driven football analysis dashboard.

Additionally, GambleIt features a custom-built, backtrack-driven **Parlay Optimization Engine** that synthesizes multiple match outcomes and secondary bet lines to automatically recommend optimized accumulator slips based on strict safety and odds thresholds.

---

## ✨ Core Features

*   🤖 **AI-Driven Match Analytics**: Utilizes Google Gemini 1.5 Flash to generate precise match outcomes, win/draw/loss probabilities, scorelines, logical betting tips, and 2-3 paragraph detailed tactical breakdowns for today's fixtures.
*   📊 **Intelligent Betting Tips & Odds Engine**: Outlines a primary "Smart Bet" selection alongside 9 additional bet markets (Double Chances, Over/Under 2.5 Goals, Both Teams To Score (BTTS), and +1.5 Goal Handicaps) accompanied by simulated fair-value decimal odds.
*   🧮 **Backtracking Parlay Accumulator**: An advanced combinatorics engine that runs a recursive backtracking search to select the highest-confidence, logically consistent bets across fixtures to match target odd ranges (`Safe 3-Leg @ ~2.0x`, `Balanced 4-Leg @ ~2.75x`, and `Value 5-Leg @ ~3.5x`).
*   🎨 **Premium Glassmorphic Dashboard**: A highly polished UI styled with Tailwind CSS v4, featuring a sleek slate dark-mode palette, glowing ambient card borders, micro-animations, responsive league filtering, and dynamic sliding overlays.
*   🛡️ **Dual-Layer Fallback Architecture**:
    *   *No Football API Key?* The app automatically falls back to an extensive set of built-in mock fixtures.
    *   *No Gemini API Key?* The app deploys an algorithmic seeded probability generator that ensures 100% functionality with deterministic, mathematically sound predictions, scores, and bet lines.

---

## 🛠️ Technology Stack

*   **Core Framework**: Next.js 16.2 (App Router with fully cached and revalidated Route Handlers)
*   **Frontend Library**: React 19.2 (Functional client components with modern hooks)
*   **Styling System**: Tailwind CSS v4 (Leveraging new theme layers and native PostCSS processing)
*   **UI Icons**: Lucide React
*   **HTTP & REST Integration**: Native Fetch API with structured Route Revalidation
*   **Language**: TypeScript 5.x (Strict type safety across fixtures, stats, and predictions)

---

## 📂 Directory Structure

```text
gambleit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parlay/
│   │   │   │   └── route.ts         # Parlay recommendation endpoint (GET)
│   │   │   └── predictions/
│   │   │       └── route.ts         # Match predictions generation endpoint (GET)
│   │   ├── favicon.ico
│   │   ├── globals.css              # Custom font and tailwind definitions
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main application dashboard (Client Component)
│   ├── components/
│   │   ├── BettingTipBadge.tsx      # Renders formatted betting recommendations
│   │   ├── LeagueFilter.tsx         # Interactive horizontal filter for leagues
│   │   ├── LoadingSpinner.tsx       # Ambient dynamic loading indicator
│   │   ├── MatchCard.tsx            # Main match entry with scores, bars & tips
│   │   ├── MatchDetailsModal.tsx    # Modal displaying deep-dive AI tactical analysis
│   │   ├── Navbar.tsx               # Polished brand header
│   │   ├── ParlayPanel.tsx          # Display for the optimized parlay accumulator slips
│   │   ├── PredictionBadge.tsx      # Displays win/loss outcomes with confidence color-scaling
│   │   └── StatsBar.tsx             # Tri-segment visual bar showing Home/Draw/Away %
│   ├── lib/
│   │   ├── football.ts              # Connects to football-data.org with mock failovers
│   │   ├── gemini.ts                # Gemini API prompt, pipeline, and mathematical fallback
│   │   ├── mockData.ts              # Pre-populated fixtures and comprehensive team statistics
│   │   └── parlay.ts                # Backtracking optimization engine for betting slips
│   └── types/
│       └── index.ts                 # Centralized TypeScript definitions and interfaces
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

---

## 🚀 Getting Started

Follow these steps to set up and run GambleIt locally.

### 1. Clone & Install Dependencies
First, open your terminal and navigate to the project directory:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the `gambleit` directory:
```env
# Google Gemini API Key (Required for AI-powered predictions)
GEMINI_API_KEY=your_gemini_api_key_here

# Football Data API Token (Optional — mock data is automatically used if empty)
FOOTBALL_API_KEY=your_football_data_token_here
```

#### 🔑 How to acquire your free API keys:
1.  **Google Gemini API Key**:
    *   Navigate to the [Google AI Studio](https://aistudio.google.com).
    *   Click **"Get API Key"** and create a new key.
    *   Copy the key into your `.env.local` file as `GEMINI_API_KEY`.
2.  **Football Data API Token** (Optional):
    *   Navigate to the [Football Data Registration Client](https://www.football-data.org/client/register).
    *   Register for a free tier account.
    *   Retrieve the authentication token sent to your email and paste it as `FOOTBALL_API_KEY`.
    *   *Note: The free tier officially covers major competitions such as the Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view your dashboard!

---

## 🧠 Technical Deep-Dive

### 1. The AI Prediction Pipeline (`src/lib/gemini.ts`)
When a match prediction is requested, GambleIt gathers the fixture details along with the home and away teams' seasonal statistics (form, goal tallies, wins/draws/losses). It routes this context to **Gemini 1.5 Flash** using a highly engineered, strict JSON-returning prompt.

#### Prompt Engineering & Consistency Controls
To avoid JSON parsing errors and logical contradictions, the system instructs Gemini to conform to a strict schema:
*   **Exact Math Constraint**: It enforces that `homeWinPct` + `drawPct` + `awayWinPct` must equal exactly **100**.
*   **Logical Consistency**: Enforces that the predicted `outcome` must match the numerical scoreline (e.g. if a Home Win is predicted, the home team's goals in the `scoreline` string must exceed the away team's goals).
*   **Odds Calibration**: Auto-calculates fair odds for secondary bet lines using the formula `95 / probability` (simulating a standard 5% bookmaker vig).
*   **Value Selection**: Selects a "Smart Bet" that strikes a healthy risk-to-reward balance (targeting an implied probability between 55% and 80%) rather than simply recommending heavily juiced heavy favorites.

#### Algorithmic Seeded Fallback
If the Gemini API key is missing or encounters a rate-limiting issue, the system executes a deterministic fallback generator:
1.  **Strength Coefficient**: Computes Home/Away strength ratings using seasonal performance:
    $$\text{Strength} = (\text{Wins} \times 3) + \text{Draws} + \text{Goals Scored} - \text{Goals Conceded}$$
2.  **Win Probabilities**: Computes clamp-constrained probabilities using base expectations adjusted for home advantage and the strength differential.
3.  **Deterministic Outcome Resolution**: Converts the calculated probabilities into a logical outcome, scoreline, and betting tips, keeping predictions identical across page reloads using a name-seeded hash generator.

---

### 2. The Parlay Optimizer Engine (`src/lib/parlay.ts`)
A sports parlay (or accumulator) combines multiple individual bets (legs) into a single ticket. The total odds are multiplicative:
$$\text{Total Odds} = \text{Leg}_1 \times \text{Leg}_2 \times \dots \times \text{Leg}_N$$
The hurdle in building a parlay is that you cannot include multiple outcomes from the *same* fixture (which is an illegal bet), and you want to maximize joint probability while aligning as closely as possible to a specific betting profile.

#### Recursive Backtracking Algorithm
`parlay.ts` implements a depth-first search (DFS) backtracking algorithm with search space pruning:
1.  **Candidate Gathering**: Takes all today's predicted outcomes and all 9 secondary lines per match, formatting them into candidate legs sorted in descending order of individual probability (safest first).
2.  **Fixture Grouping**: Organizes candidates by their parent fixture ID to ensure that **no single fixture has more than one leg selected**.
3.  **Odds Targeting & Backtracking**:
    *   **Goal**: Find a combination of exactly $N$ legs (where $N \in \{3, 4, 5\}$) that comes closest to a target total odd value (e.g., $2.0x$ for safe, $2.75x$ for balanced, $3.5x$ for value).
    *   **Heuristic Pruning**: If at any step the accumulated odds multiply to more than double the target value and the ticket is not yet complete, the branch is immediately pruned to maintain high performance.
    *   **Combinatorial Search**:
        ```typescript
        function backtrack(idx: number, currentPicks: ParlayLeg[], currentOdds: number) {
          if (currentPicks.length === count) {
            const diff = Math.abs(currentOdds - targetOdds);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestPicks = [...currentPicks];
            }
            return;
          }
          // Pruning and recursive branching ...
        }
        ```
4.  **Slip Formatting**: Outputs the selected legs, total multiplicative odds, collective implied joint probability, and a contextual AI reasoning block explaining the slip's structural logic.

---

## 📡 API Reference

### 1. `GET /api/predictions`
Fetches the matches scheduled for today and builds full AI predictions.
*   **Caching**: Configured with `revalidate = 3600` (1-hour edge caching).
*   **Sample Response**:
    ```json
    {
      "predictions": [
        {
          "fixture": {
            "id": 12048,
            "date": "2026-05-20T19:45:00Z",
            "homeTeam": { "name": "Arsenal FC", "shortName": "Arsenal", "crest": "..." },
            "awayTeam": { "name": "Chelsea FC", "shortName": "Chelsea", "crest": "..." },
            "league": { "name": "Premier League", "country": "England" },
            "venue": "Emirates Stadium"
          },
          "prediction": {
            "outcome": "Home Win",
            "confidence": 72,
            "scoreline": "2-1",
            "bettingTip": "Double Chance: 1X (Home or Draw)",
            "insight": "Arsenal's lethal home form should carry them through a highly competitive Chelsea clash.",
            "homeWinPct": 60,
            "drawPct": 25,
            "awayWinPct": 15,
            "detailedAnalysis": "...",
            "additionalBets": [...]
          }
        }
      ],
      "generatedAt": "2026-05-20T04:00:00Z",
      "total": 1
    }
    ```

### 2. `GET /api/parlay`
Synthesizes the active predictions and builds the three optimized parlay slips.
*   **Caching**: Configured with `revalidate = 3600` (1-hour edge caching).
*   **Sample Response**:
    ```json
    {
      "slips": [
        {
          "legs": 3,
          "label": "Safe 3-Leg",
          "targetPayoutRange": "~2x",
          "totalOdds": 2.05,
          "impliedProbability": 48.2,
          "picks": [
            { "fixtureId": 12048, "homeTeam": "Arsenal", "awayTeam": "Chelsea", "bet": "Double Chance: 1X (Home or Draw)", "probability": 85, "decimalOdds": 1.12 }
          ],
          "aiReasoning": "..."
        }
      ],
      "generatedAt": "2026-05-20T04:00:00Z"
    }
    ```

---

## ☁️ Deployment (Vercel)

GambleIt is optimized for seamless deployment on Vercel:

1.  Push the project code to a GitHub, GitLab, or Bitbucket repository.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
3.  Import your repository.
4.  In the configuration dashboard, ensure the **Root Directory** points to the `gambleit` folder.
5.  Expand **Environment Variables** and add your keys:
    *   `GEMINI_API_KEY`
    *   `FOOTBALL_API_KEY`
6.  Click **Deploy**. Vercel will build the serverless API routes and edge-render your React dashboard!

---

## 🛡️ Disclaimer

GambleIt is designed solely for **entertainment, statistical analysis, and educational purposes**.
*   **No Real Money Betting**: This app does not facilitate real-money gambling, nor does it connect to any sportsbook APIs to place actual bets.
*   **No Financial Advice**: Predictions, odds, and accumulator slips are simulated and generated through AI prompts or statistical seed algorithms. Past performance does not guarantee future results.
*   Please bet responsibly and never wager money you cannot afford to lose. If you or someone you know has a gambling problem, seek assistance from certified support organizations.
