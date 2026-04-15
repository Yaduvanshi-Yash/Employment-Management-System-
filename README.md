# Employment Management System

<<<<<<< HEAD
A full-stack employee management platform built with React, Express, and MongoDB for managing team assignments, tracking task progress, reviewing completed work, and visualizing workforce analytics.

## Overview

This project is designed like a real internal operations tool. Admins can create and review tasks, monitor team activity, and use analytics to understand delivery performance. Employees can manage their assigned work, update task status, and track their own progress through a cleaner personal dashboard.

## Highlights

- Role-based authentication for admin and employee users
- JWT-protected backend APIs
- Admin workspace with analytics, task planning, review tools, and activity tracking
- Employee workspace with task board, performance insights, and personal activity feed
- Task lifecycle support for `new`, `active`, `complete`, and `failed`
- Priority system with `low`, `medium`, `high`, and `urgent`
- Review and rating flow for completed tasks
- CSV export for task insights
- Calendar-based task planning view
- Activity timeline for assignments, status changes, and reviews
- MongoDB support with local JSON fallback for development
- Responsive interface built with React, Vite, and Tailwind CSS

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose, local JSON fallback
- Authentication: JWT, bcrypt
- Email: Nodemailer
- Deployment: Vercel frontend, Render or Railway backend, MongoDB Atlas

## Core Features

### Admin

- Log in with admin credentials
- Create and assign tasks to employees
- Set task category, due date, and priority
- Search and filter tasks by employee, status, and priority
- Review completed tasks with ratings and feedback
- Export filtered task data as CSV
- View analytics for task health, productivity, and team performance
- Use a calendar-based planning section for upcoming deadlines
- Monitor recent team activity from a timeline feed

### Employee

- Log in with employee credentials
- View assigned tasks in a dedicated task board
- Accept, complete, fail, or reopen tasks
- Check task counts, overdue tasks, and average rating
- View personal insights such as growth score and workload risk
- Read admin review feedback
- Track recent task-related activity
=======
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
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

## Project Structure

```text
EMS/
<<<<<<< HEAD
  src/        React frontend
  server/     Express backend API
  public/     Static assets
  dist/       Production build output
```

## Local Setup

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the frontend:
=======
  src/        frontend app
  server/     backend API
  public/     static assets
```

## Notes

- MongoDB-ready files live in `server/config`, `server/models`, `server/utils`, and `server/docs/database-design.md`
- The API uses MongoDB-backed auth and task/employee queries when `MONGODB_URI` is present
- Run `npm run seed:mongo` once to load demo data into MongoDB
- Deployment order and env setup are documented in `DEPLOYMENT.md`
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

```bash
npm run dev
```

<<<<<<< HEAD
Start the backend:
=======
- Add refresh token or secure cookie auth
- Add validation and better error handling across all forms
- Add tests for backend routes
- Add production logging and monitoring
- Improve role-based route protection in the frontend
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

```bash
npm run server
```

<<<<<<< HEAD
Start the backend in watch mode:

```bash
npm run dev:server
```

Seed MongoDB if needed:

```bash
npm run seed:mongo
```

## Environment Variables

Copy values from `.env.example` and set them for your local or deployed environment:

```env
PORT=5000
CLIENT_URL=http://localhost:5173,https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster-url/
MONGODB_DB_NAME=ems
JWT_SECRET=replace-with-a-long-random-secret
VITE_API_URL=http://127.0.0.1:5000/api
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password-16-chars
ADMIN_COMPANY_CODES=1234,5678,9012
EMPLOYEE_COMPANY_CODES=3456,7890,2345
```

## API Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/analytics/admin`
- `GET /api/employees`
- `GET /api/employees/:employeeId`
- `GET /api/employees/:employeeId/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId/status`
- `PATCH /api/tasks/:taskId/review`

## Demo Notes

- Local development can run with MongoDB or the JSON fallback store
- Registration supports company-code-based role assignment
- Email delivery is optional; signup still works if Gmail SMTP is not configured

## Why This Project Is Strong For A Resume

- Demonstrates frontend and backend integration in a real workflow-based product
- Shows protected route design, JWT auth, and role-based access control
- Includes practical business features instead of only CRUD pages
- Highlights dashboard thinking with analytics, review flow, and activity tracking
- Shows deployment readiness with environment-based configuration

## Suggested Additions For GitHub

- Add screenshots for login, admin dashboard, employee dashboard, task board, and analytics
- Add a live demo link after deployment
- Add backend test coverage for auth and task flows

## Deployment

Deployment guidance is available in [DEPLOYMENT.md](./DEPLOYMENT.md).

Recommended order:

1. Configure MongoDB Atlas
2. Deploy the backend
3. Set the frontend `VITE_API_URL`
4. Deploy the frontend
5. Run a final smoke test for login, task creation, status updates, analytics, and reviews
=======
Feel free to fork the repository and improve the project.
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

## Contact

- GitHub: https://github.com/Yaduvanshi-Yash
