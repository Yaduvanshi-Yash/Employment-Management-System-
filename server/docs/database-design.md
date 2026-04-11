# MongoDB Design

This backend is ready to move from the temporary JSON file store to MongoDB.

## Collections

### `users`

Use one collection for both admins and employees.

Example fields:

```json
{
  "_id": "ObjectId",
  "firstName": "Amit",
  "lastName": "",
  "email": "e@e.com",
  "passwordHash": "bcrypt-hash",
  "role": "employee",
  "isActive": true,
  "createdAt": "2026-04-11T00:00:00.000Z",
  "updatedAt": "2026-04-11T00:00:00.000Z"
}
```

Why one collection:

- login becomes simpler
- role-based access stays clean
- admin and employee data share most fields

### `tasks`

Store tasks in a separate collection and reference the employee and creator.

Example fields:

```json
{
  "_id": "ObjectId",
  "taskTitle": "Design Landing Page",
  "taskDescription": "Create UI layout for landing page",
  "taskDate": "2026-03-10T00:00:00.000Z",
  "category": "Design",
  "status": "new",
  "assignedTo": "ObjectId(users)",
  "createdBy": "ObjectId(users)",
  "completedAt": null,
  "createdAt": "2026-04-11T00:00:00.000Z",
  "updatedAt": "2026-04-11T00:00:00.000Z"
}
```

Why separate tasks:

- easier to query by employee, status, or date
- avoids giant employee documents over time
- cleaner for analytics, filters, and pagination

## Indexes

Recommended indexes:

- `users.email` unique
- `users.role`
- `tasks.assignedTo + status + taskDate`
- `tasks.createdBy + createdAt`

## Mapping to the current frontend

The current frontend expects these task flags:

- `newTask`
- `active`
- `complete`
- `failed`

MongoDB should store a single `status` field instead. Convert `status` into those flags when sending API responses.

## Database URI you need to provide

Add this to your local `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
MONGODB_DB_NAME=ems
```

Once you share the URI, the next step is updating the routes to read and write from MongoDB instead of `server/data/db.json`.
