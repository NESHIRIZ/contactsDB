# Contacts API

This repository implements the Contacts API required for BYU-Idaho W03 Project: CRUD Operations.

## Live demo
- Render URL: https://contactsdb-o4ps.onrender.com
- Swagger UI: https://contactsdb-o4ps.onrender.com/api-docs

## Repository
- GitHub: https://github.com/NESHIRIZ/contactsDB

## API Endpoints
- GET /contacts
- GET /contacts/:id
- POST /contacts
- PUT /contacts/:id
- DELETE /contacts/:id

## Local setup
1. Copy `.env.example` to `.env` and set your values:

```env
MONGODB_URI=<your mongodb connection string>
MONGODB_DB=contactsDB
PORT=3000
BASE_URL=http://localhost:3000
```

2. Install dependencies and run locally:

```bash
npm install
npm run dev
```

3. Seed the database (requires `MONGODB_URI` set):

```bash
npm run seed
```

## Deployment to Render
1. Create a new Render Web Service and connect your GitHub repo.
2. Configure service environment variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `MONGODB_DB` = `contactsDB`
   - `BASE_URL` = your Render URL
3. Use `npm start` as the start command.
4. After deploy, verify Swagger at `/api-docs`.

## Notes
- `.env` is ignored by git; `node_modules` is ignored by `.gitignore`.
- The application listens on `process.env.PORT || 3000`.
- Swagger documentation is available at `/api-docs` and includes request/response schemas.

## Video checklist
- Show Swagger UI and execute GET/POST/PUT/DELETE routes.
- Show MongoDB Compass or Atlas data with contacts.
- Show `.env` is not committed and `node_modules` is ignored.
- Show Render deployment with `/api-docs` working.
