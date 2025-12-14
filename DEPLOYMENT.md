# Deploying to Vercel

Your Flow Kanri application is fully compatible with Vercel. Follow these steps to deploy successfully.

## 1. Prerequisites

- **GitHub Account**: Push your code to a GitHub repository.
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
- **MongoDB Atlas**: You already have this set up!

## 2. Configuration Steps

### Step A: Allow Vercel to Access MongoDB

Vercel uses dynamic IP addresses, so you must allow access from anywhere.

1. Go to **MongoDB Atlas Dashboard**.
2. Click **Network Access** in the sidebar.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (0.0.0.0/0).
5. Click **Confirm**.

> **Note**: This is standard practice for serverless deployments. Your database is still protected by your username and password.

### Step B: Create Vercel Project

1. Go to your Vercel Dashboard.
2. Click **Add New** > **Project**.
3. Import your `flow-kanri` GitHub repository.

### Step C: Configure Environment Variables

**CRITICAL**: You must add your MongoDB connection string.

1. In the "Configure Project" screen, find **Environment Variables**.
2. Add a new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your connection string (same as in your `.env.local` file)
3. Click **Add**.

### Step D: Deploy

1. Click **Deploy**.
2. Wait for the build to complete (usually 1-2 minutes).
3. Once done, you'll get a production URL (e.g., `flow-kanri.vercel.app`).

## 3. Data & Seeding

**Important**: Your deployment will connect to the _same_ MongoDB database as your local development if you use the same connection string.

- **If you already seeded data locally**: It will show up in production immediately! You don't need to do anything else.
- **If you want to reset data**: Run the seed script **locally** on your machine. Since it connects to the same cloud database, the changes will appear in production.

```bash
# Run this locally to update production data
node scripts/seed-data.js
```

## 4. Real-time Updates in Production

The polling mechanism we implemented (5-second intervals) works perfectly on Vercel.

- You can keep the production tab open.
- Send a request via Postman/Curl to the production API (`https://your-app.vercel.app/api/calculate`).
- The UI will update automatically.

## Debugging

If you see errors in production:

1. Go to Vercel Dashboard > Your Project.
2. Click **Logs**.
3. Look for filters or error messages.
4. Common issue: `MongoServerSelectionError` usually means IP whitelist is not set to `0.0.0.0/0`.
