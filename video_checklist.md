Video checklist and script for W02 Project: Contacts Part 2

Purpose: Produce a 5–8 minute demonstration that satisfies the rubric and shows the deployed API working with Swagger and MongoDB.

Checklist
- [ ] Deploy app to Render with `BASE_URL` set to your Render URL and `MONGODB_URI` set in environment variables.
- [ ] Confirm `node_modules` and `.env` are not committed to GitHub.
- [ ] Run `npm run seed` (after deployment or locally) to insert 5 contacts.
- [ ] Open MongoDB Compass and show the `contacts` collection with 5 documents having fields: `firstName`, `lastName`, `email`, `favoriteColor`, `birthday`.
- [ ] Open `https://your-app.onrender.com/api-docs` (use your Render URL) and exercise each endpoint in Swagger UI: GET all, GET by id, POST, PUT, DELETE.
- [ ] Show database changes in Compass after POST/PUT/DELETE requests.
- [ ] Show `server.js`, `routes/contacts.js`, `controllers/contacts.js`, and `data/database.js` to explain MVC architecture and `.env` usage.
- [ ] Confirm Swagger displays your Render URL in the top (servers) list.

Suggested script (5-8 minutes)
1. (0:00–0:30) Intro: state your name, repo link, Render URL, and what the video will show.
2. (0:30–1:30) Show MongoDB Compass with `contacts` collection containing 5 records; briefly point to the required fields.
3. (1:30–3:30) Open Swagger UI at `https://contactsdb-o4ps.onrender.com/api-docs` and run each endpoint:
   - GET /contacts — show list
   - GET /contacts/{id} — pick one id and show result
   - POST /contacts — create a new contact; show response id
   - PUT /contacts/{id} — update the new contact; show 204 response
   - DELETE /contacts/{id} — delete the new contact; show 204 response
4. (3:30–4:30) Switch to MongoDB Compass and show that the POST/PUT/DELETE changed the data as expected.
5. (4:30–5:30) Show project structure in your repo: `server.js`, `routes/contacts.js`, `controllers/contacts.js`, `data/database.js`, and `swagger.json`.
6. (5:30–6:00) Security: show `.gitignore` contains `.env`, and explain credentials are not in GitHub.
7. (6:00–6:30) Closing: provide GitHub repo link and Render URL again, invite grader to reach out if issues.

Notes
- Keep the video under 8 minutes. Trim talk if you go over time.
- If Render has CORS or startup delays, wait for the app to be online before recording calls.

Commands to run locally for verification
```bash
npm install
npm run seed   # seeds 5 contacts (requires MONGODB_URI in .env)
npm start
# Verify Swagger UI: https://contactsdb-o4ps.onrender.com/api-docs
```
