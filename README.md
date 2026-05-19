Contacts API
=============

This repository implements the Contacts API required for W02 Project: Contacts Part 2.

Live demo
- Render URL: https://contactsdb-o4ps.onrender.com
- Swagger UI: https://contactsdb-o4ps.onrender.com/api-docs

Repository
- GitHub: https://github.com/you/yourRepo (replace with your repo URL)

API Endpoints
- GET /contacts
- GET /contacts/:id
- POST /contacts
- PUT /contacts/:id
- DELETE /contacts/:id

Local setup
1. Copy `.env.example` (or create `.env`) and set:

```
MONGODB_URI=<your mongodb connection string>
PORT=3000
BASE_URL=http://localhost:3000
```

2. Install and run locally:

```bash
npm install
npm start
```

3. Seed the database (requires `MONGODB_URI` set):

```bash
npm run seed
```

Deployment to Render
1. Create a new Render Web Service, connect your GitHub repo.
2. Set the environment variables for the service (Render dashboard → Environment):
   - `MONGODB_URI` = your MongoDB connection string
   - `BASE_URL` = https://contactsdb-o4ps.onrender.com
3. Set the start command (if needed): `npm start` and deploy.
4. After the service is live, visit `/api-docs` to confirm Swagger lists your Render URL.

Video checklist (short)
- Show Swagger UI at `https://contactsdb-o4ps.onrender.com/api-docs` and exercise each route.
- Show MongoDB Compass with at least 5 contacts (fields: `firstName`, `lastName`, `email`, `favoriteColor`, `birthday`).
- Show POST/PUT/DELETE modify the DB and show updates in Compass.
- Show `.env` is not committed and `node_modules` is ignored.

Notes
- `server.js` updates the Swagger `servers` entry dynamically from `process.env.BASE_URL`.
- If `npm run seed` fails due to network/DNS (Atlas), run the seed from a machine with network access.

Contact
- If you want, I can update the `package.json` `homepage` field and push a small README change to your repo.
