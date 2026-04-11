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
MONGODB_DB_NAME=EMS
```

Important:

- Rotate the MongoDB password before public production use if the connection string has been shared anywhere

## 2. Backend Second

Recommended host: Render or Railway

Required backend environment variables:

```env
PORT=5000
CLIENT_URL=https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster-url/
MONGODB_DB_NAME=EMS
JWT_SECRET=replace-with-a-long-random-secret
```

Backend build/start:

```bash
npm install --legacy-peer-deps
npm run server
```

After backend deploy:

- Open `/api/health`
- Confirm login works on `/api/auth/login`
- Run `npm run seed:mongo` once if your production database is empty

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
- Backend CORS includes the deployed frontend URL
- Atlas allows the backend host to connect
