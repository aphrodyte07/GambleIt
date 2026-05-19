# GambleIt — AI Football Predictions

AI-powered football predictions using Google Gemini and football-data.org.

## Get Your Free API Keys

**Gemini API (required for AI predictions):**
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Copy the key into .env.local as GEMINI_API_KEY

**Football Data API (optional — mock data used if absent):**
1. Go to https://www.football-data.org/client/register
2. Register for free
3. Copy the token into .env.local as FOOTBALL_API_KEY
4. Free tier covers PL, La Liga, Bundesliga, Serie A, Ligue 1

## Run Locally
npm install
npm run dev
Open http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo
2. Go to https://vercel.com and import the repo
3. In Vercel project settings > Environment Variables, add:
   - GEMINI_API_KEY
   - FOOTBALL_API_KEY
4. Click Deploy

The app works without FOOTBALL_API_KEY using built-in mock fixtures.
The app works without GEMINI_API_KEY using algorithmic predictions.
