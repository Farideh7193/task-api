# Task API

A small REST API for managing tasks, built as a learning project to practise
**TypeScript, Node.js/Express, PostgreSQL, Docker and GitHub Actions (CI)**.

> Note: this project was created with the help of an AI assistant as a learning
> exercise and then studied, run and extended by me.

## Features

- CRUD endpoints for tasks (`/tasks`)
- Input validation and clear HTTP status codes (400 / 404 / 201 / 204)
- Storage behind a `TaskRepository` interface:
  - PostgreSQL when `DATABASE_URL` is set
  - in-memory storage otherwise (used in tests)
- Automated tests (Jest + Supertest)
- Dockerfile (multi-stage) and `docker-compose.yml` (API + PostgreSQL)
- GitHub Actions pipeline: install, build, test, Docker build

## Run with Docker

```bash
docker compose up --build
```

The API is then available at http://localhost:3000.

## Run locally (without Docker)

```bash
npm install
npm run dev     # in-memory storage
npm test        # run the tests
npm run build   # compile TypeScript to dist/
```

## Endpoints

| Method | Path          | Description                          |
|--------|---------------|--------------------------------------|
| GET    | `/health`     | Health check                         |
| GET    | `/tasks`      | List all tasks                       |
| GET    | `/tasks/:id`  | Get one task                         |
| POST   | `/tasks`      | Create a task (`{"title": "..."}`)   |
| PUT    | `/tasks/:id`  | Update `title` and/or `done`         |
| DELETE | `/tasks/:id`  | Delete a task                        |

Example:

```bash
curl -X POST localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Learn Docker"}'
curl localhost:3000/tasks
```

## Project structure

```
src/
  app.ts                       Express app (routes, validation)
  server.ts                    Entry point (chooses PostgreSQL or in-memory)
  types.ts                     Task type
  repository/                  Storage layer (interface + 2 implementations)
test/tasks.test.ts             API tests
Dockerfile, docker-compose.yml Containers
.github/workflows/ci.yml       CI pipeline
```

## Ideas for next steps

- Add authentication
- Add pagination and filtering
- Add integration tests against a real PostgreSQL container
