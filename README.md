# Employment Management System

A modern and responsive Employment Management System built with React, Express, and MongoDB for managing employee tasks, tracking progress, and simulating a real-world workflow.

## Overview

This project started as a frontend dashboard and has now been upgraded into a full-stack application with:

- React + Vite frontend
- Express backend API
- MongoDB database integration
- JWT-based authentication

## Features

- Admin and employee login flow
- Employee and admin dashboards
- Task creation and assignment
- Task status tracking: new, active, complete, failed
- Backend API with protected routes
- MongoDB-backed data storage
- Responsive UI and cleaner dashboard layout

## Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Authentication: JWT, bcrypt
- Deployment: Vercel for frontend, separate backend host, MongoDB Atlas for database

## Run the app

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
npm run server
```

Start the backend in watch mode:

```bash
npm run dev:server
```

Seed MongoDB with the current demo data:

```bash
npm run seed:mongo
```

## Real authentication

- Login uses `POST /api/auth/login`
- Protected routes require a signed JWT bearer token
- Session restore uses `GET /api/auth/me`
- Set `JWT_SECRET` in your local `.env` for production-style token signing

## Backend environment

Copy values from `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173,https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster-url/
MONGODB_DB_NAME=ems
JWT_SECRET=replace-with-a-long-random-secret
VITE_API_URL=http://localhost:5000/api
```

## Demo login

- Admin: `admin@example.com` / `123`
- Employee: `e@e.com` / `123`

## API endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/employees`
- `GET /api/employees/:employeeId`
- `GET /api/employees/:employeeId/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId/status`

## Project Structure

```text
EMS/
  src/        frontend app
  server/     backend API
  public/     static assets
```

## Notes

- MongoDB-ready files live in `server/config`, `server/models`, `server/utils`, and `server/docs/database-design.md`
- The API uses MongoDB-backed auth and task/employee queries when `MONGODB_URI` is present
- Run `npm run seed:mongo` once to load demo data into MongoDB
- Deployment order and env setup are documented in `DEPLOYMENT.md`

## Future Improvements

- Add refresh token or secure cookie auth
- Add validation and better error handling across all forms
- Add tests for backend routes
- Add production logging and monitoring
- Improve role-based route protection in the frontend

## Contributing

Feel free to fork the repository and improve the project.

## Contact

- GitHub: https://github.com/Yaduvanshi-Yash
