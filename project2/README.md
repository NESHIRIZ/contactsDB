# Project 2 API

This Week 03 API implements CRUD operations for a library-style application with books and authors.

## Features
- Two collections: `books` and `authors`
- Books have 8 required fields
- Authors have 8 required fields
- Full CRUD routes for both collections
- Data validation and error handling
- Swagger documentation available at `/api-docs`
- Configurable MongoDB connection via `.env`

## Setup
1. Copy `.env.example` to `.env`
2. Edit `.env` with your MongoDB credentials
3. Install dependencies

```bash
cd project2
npm install
```

4. Start the API

```bash
npm start
```

5. Open Swagger UI

```text
http://localhost:3000/api-docs
```

## Endpoints
### Books
- GET `/api/books`
- GET `/api/books/:id`
- POST `/api/books`
- PUT `/api/books/:id`
- DELETE `/api/books/:id`

### Authors
- GET `/api/authors`
- GET `/api/authors/:id`
- POST `/api/authors`
- PUT `/api/authors/:id`
- DELETE `/api/authors/:id`

## Deployment
- Set `MONGODB_URI`, `MONGODB_DB`, and `BASE_URL` as Render environment variables
- Use `npm start` as the start command

## Notes
- `.env` is ignored by the repository root `.gitignore`
- Use the included `project2.rest` file to test all CRUD operations
