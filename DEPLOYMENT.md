# Deployment Guide: GFG Code Colosseum

This platform is structured for a decoupled, high-performance production setup:
- **Frontend (Vite + React)**: Deployed to **Vercel** (Global Edge CDN, instantaneous page loads).
- **Backend (Node.js + Express API)**: Deployed to **Render** (Centralized contest state, participant sync, live admin dashboard).

---

## Architecture Overview

```
[Student Device]  \
                   ===> [ Vercel Frontend ] ===> [ Render Express API ] ===> [ Persistent JSON DB ]
[Admin Dashboard] /
```

- **Live Synchronization**:
  - When students submit assessments from their devices, their responses and scores are immediately saved to the Render backend.
  - The Admin dashboard automatically polls the backend every 4 seconds, displaying real-time submissions as they happen.
  - The Admin can open or lock contest access with a single click, instantly updating all active student lobbies.

---

## Step 1: Push Changes to GitHub

If you haven't pushed your local commits to your GitHub repository yet, run:

```bash
git add .
git commit -m "Add Express backend API and Vercel/Render deployment configs"
git push origin main
```

*(If you created a new GitHub repository, follow GitHub's remote setup commands to push).*

---

## Step 2: Deploy Backend to Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repository (`GFG-Code-Colosseum`).
4. Configure the service settings:
   - **Name**: `gfg-code-colosseum-api` (or your preferred name)
   - **Region**: Closest to your users (e.g., Singapore / Frankfurt / Oregon)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Instance Type**: `Free`
5. Under **Advanced** -> **Health Check Path**, enter:
   ```
   /api/health
   ```
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public URL (e.g., `https://gfg-code-colosseum-api.onrender.com`).
8. Test that it's running by visiting:
   ```
   https://gfg-code-colosseum-api.onrender.com/api/health
   ```
   It should return: `{"status":"ok", ...}`.

---

## Step 3: Deploy Frontend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`GFG-Code-Colosseum`).
4. In the configuration screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - **`VITE_API_URL`**: Your Render backend URL (e.g. `https://gfg-code-colosseum-api.onrender.com` without trailing slash)
   - **`VITE_GEMINI_API_KEY`**: `your_gemini_api_key_here`
6. Click **Deploy**.
7. Vercel will build the project and provide your live production domain (e.g., `https://gfg-code-colosseum.vercel.app`).

---

## Step 4: Verification & Live Contest Testing

1. **Open Student View**:
   - Visit your Vercel URL on a laptop or phone.
   - Enter your student details and click **Enter Code Colosseum**.
   - Start the assessment, answer questions, and submit.

2. **Open Admin View**:
   - Open an incognito window or another browser.
   - Log in with any whitelisted admin email (e.g. `sathvikguttula@gmail.com` or `abhay.23bce7190@vitapstudent.ac.in`).
   - The participant's submission, score, qualification status, and time taken will appear live on the Admin Dashboard!
   - Test toggling **Test Access** or updating the **Cutoff Mark** and verify that student devices reflect the changes.
