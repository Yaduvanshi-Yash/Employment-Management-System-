# Deployment Order

Deploy this project in the following order:

## 1. Database First

Use MongoDB Atlas.

Set up:

- Create or reuse your Atlas cluster
- Create a database user with read/write access
- Add your backend host IP to Atlas network access
- Keep your connection string in this format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-url/
MONGODB_DB_NAME=ems
```

Important:

- Rotate the MongoDB password before public production use if the connection string has been shared anywhere
- The backend now refuses to boot in production if `MONGODB_URI` is missing, which prevents accidental deployment with the local demo file store
- Use a fresh strong `JWT_SECRET` in production. The backend now also refuses to boot in production if `JWT_SECRET` is missing.

## 2. Backend Second

Recommended host: Render or Railway

Required backend environment variables:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster-url/
MONGODB_DB_NAME=ems
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_COMPANY_CODES=1234,5678,9012
EMPLOYEE_COMPANY_CODES=3456,7890,2345
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password-16-chars
```

Notes:

- `CLIENT_URL` can contain multiple comma-separated origins if needed
- Add every frontend origin you plan to use, including preview or alternate domains, or browser requests will fail CORS checks
- Email is optional; if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are omitted, signup still works but credentials email is skipped
- Rotate any MongoDB, JWT, or Gmail secrets before production if they were ever shared locally
- Do not rely on the local JSON fallback store for deployment because it seeds demo data and is not suitable for public hosting
- Set `NODE_ENV=production` on the backend so the production safety checks are actually enforced

Backend build/start:

```bash
npm install --legacy-peer-deps
npm run server
```

After backend deploy:

- Open `/api/health`
- Confirm login works on `/api/auth/login`
- Run `npm run seed:mongo` once only if you intentionally want demo data in the production database

Example backend URL:

```text
https://ems-api.onrender.com
```

## 3. Frontend Last

Recommended host: Vercel

Required frontend environment variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

Frontend build:

```bash
npm install --legacy-peer-deps
npm run build
```

## Final Checks

- Frontend login works with deployed backend
- Admin can create tasks
- Employee can update task status
- Admin can review completed employee tasks
- New signup works and receives work email if Gmail SMTP is configured
- Backend CORS includes the deployed frontend URL
- Atlas allows the backend host to connect

## Git Upload Guide

Use this sequence when you are ready to publish your local changes:

```bash
git status
git diff --stat
git add .
git commit -m "Polish dashboard UI and prepare deployment"
git push -u origin main
```

If this repo is not connected to GitHub yet, run this once before the push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
```

Before pushing, make sure:

- `.env` is still untracked
- `dist/` is not committed
- your backend and frontend environment values are set in the hosting platforms, not in the repo
- you have updated `VITE_API_URL` to your deployed backend URL in the frontend host settings
