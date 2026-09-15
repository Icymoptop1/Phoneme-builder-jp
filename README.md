# Phoneme Learning Activity Builder

The Phoneme Learning Activity Builder is a full-stack educational web application designed to allow teachers to create, manage and generate phoneme-based Wordle and Word Search learning activities.

The application was developed using Next.js, React, TypeScript, Prisma and SQLite. Activity content is stored in a database and accessed through a separate backend API, allowing teachers to create reusable words, word lists and activity configurations.

The application is containerised using Docker and Docker Compose and has been deployed and tested on an AWS Academy EC2 instance.

## Project Features

### Phoneme Words

Teachers can create, view, update and delete phoneme words.

Each stored word contains:

- An English word
- A phoneme sequence
- An optional hint
- Creation and update metadata

Phonemes are stored as sequences and support multi-character phoneme representations where required.

### Word Lists

Stored words can be organised into reusable word lists.

Teachers can:

- Create word lists
- Select stored words for a list
- View existing lists
- Update list details and contents
- Delete lists

Word lists provide the database-driven source content for Wordle and Word Search activities.

### Activity Management

Teachers can create and manage multiple saved activity configurations.

Each activity stores information including:

- Activity name
- Activity type
- Linked word list
- Difficulty
- Hint preference
- Theme
- Activity-specific settings

Wordle activities can store a maximum number of attempts.

Word Search activities can store a grid size of 6×6, 8×8, 10×10 or 12×12.

### Wordle

The Wordle activity uses phonemes rather than standard alphabetic character entry.

The target word is obtained from the stored word list associated with the selected activity. The activity therefore uses database content rather than a fixed example word.

Difficulty affects the available phoneme keyboard:

- Easy provides the target phonemes with a small number of distractors.
- Medium provides additional distractor phonemes.
- Hard uses the available phonemes from the linked word list.

Students receive feedback indicating:

- Correct phoneme in the correct position
- Correct phoneme in the wrong position
- Incorrect phoneme

The activity also supports attempt limits, phoneme hints and completion feedback.

### Word Search

The Word Search activity generates a phoneme grid from words contained in the selected database word list.

Difficulty affects the number of words used and the directions in which words can be placed.

The activity supports:

- Multiple grid sizes
- Correct and incorrect selection feedback
- Progress tracking
- Completion feedback
- Optional phoneme hints
- Keyboard navigation
- Responsive grid layouts
- Light and dark themes

### Standalone HTML Generation

Wordle and Word Search activities can be exported as standalone HTML files.

The generated files contain the required:

- HTML
- CSS
- JavaScript
- Phoneme data
- Activity configuration

This allows a generated learning activity to run directly in a normal web browser without requiring the main application to remain open.

The generated activity uses the words and settings associated with the selected database-backed activity configuration.

## Technology Stack

The project uses:

- Next.js
- React
- TypeScript
- Prisma ORM
- SQLite
- Next.js Route Handlers
- Docker
- Docker Compose
- AWS Academy EC2
- HTML, CSS and JavaScript for standalone activity generation

## System Architecture

The application is separated into frontend and backend services.

```text
User Browser
     |
     v
Next.js Frontend
Port 3000
     |
     | /api requests
     v
Next.js Backend API
Port 4000
     |
     v
Prisma ORM
     |
     v
SQLite Database
```

When deployed with Docker Compose:

```text
AWS EC2
|
├── phoneme-frontend
│   └── Next.js frontend - port 3000
│
├── phoneme-api
│   └── Next.js API - port 4000
│
└── sqlite_data
    └── Persistent Docker volume
```

The frontend uses a Next.js rewrite to forward `/api/*` requests to the backend API service.

Within Docker, the frontend communicates with the API using the Docker Compose service hostname `api`.

## Repository Structure

```text
frontenddesign/
├── .gitignore
├── docker-compose.yml
├── README.md
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── public/
│   ├── utils/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── next.config.ts
│
└── api/
    ├── app/
    ├── generated/
    ├── lib/
    ├── prisma/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── next.config.ts
    └── prisma7.config.ts
```

## API Routes

The backend provides REST-style API routes for the main stored resources.

### Words

```text
GET    /api/words
POST   /api/words
GET    /api/words/:id
PUT    /api/words/:id
DELETE /api/words/:id
```

### Word Lists

```text
GET    /api/word-lists
POST   /api/word-lists
GET    /api/word-lists/:id
PUT    /api/word-lists/:id
DELETE /api/word-lists/:id
```

### Activities

```text
GET    /api/activities
POST   /api/activities
GET    /api/activities/:id
PUT    /api/activities/:id
DELETE /api/activities/:id
```

### Health Check

```text
GET /health
```

A successful health check returns HTTP `200` with:

```json
{
  "status": "ok",
  "service": "phoneme-learning-activity-builder"
}
```

## Validation and Error Handling

Server-side validation is applied before data is stored in the database.

Validation includes:

- Required word and activity names
- Valid phoneme arrays
- Non-empty phoneme values
- Multi-character phoneme support
- Valid database IDs
- Existing word references
- Existing word list references
- Valid activity types
- Valid difficulty levels
- Valid Wordle attempt limits
- Valid Word Search grid sizes
- Valid theme values
- Valid hint settings

The API returns appropriate HTTP status codes for invalid requests, missing resources and unexpected server errors.

## Database

The application uses Prisma ORM with SQLite.

The primary database models are:

- `Word`
- `WordList`
- `WordListWord`
- `Activity`

`WordListWord` provides the many-to-many relationship between stored words and reusable word lists.

An `Activity` references a `WordList`, allowing stored word lists to drive generated activity content rather than relying on a fixed example.

### Seed Data

The supplied seed script contains 90 example phoneme words divided into:

- 30 three-phoneme words
- 30 four-phoneme words
- 30 five-phoneme words

This provides example content while still allowing teachers to create and manage their own words and word lists.

## Local Development

The frontend and API are separate Next.js applications and should be run from their respective directories.

### Backend API

Open a terminal in:

```text
api/
```

Install dependencies:

```bash
npm install
```

Create an `.env` file containing:

```text
DATABASE_URL="file:./dev.db"
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Apply the database migrations:

```bash
npm run prisma:migrate
```

Seed the database:

```bash
npm run prisma:seed
```

Start the API:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:4000
```

The health endpoint is:

```text
http://localhost:4000/health
```

### Frontend

Open a second terminal in:

```text
frontend/
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

During local development, the frontend forwards API requests to the backend running on port `4000`.

## Docker Deployment

Docker Compose is used to build and run the frontend and API as separate containers.

From the repository root:

```bash
docker compose build
```

Start the containers:

```bash
docker compose up -d
```

Check their status:

```bash
docker compose ps
```

The deployed services are available at:

```text
Frontend: http://localhost:3000
API:      http://localhost:4000
Health:   http://localhost:4000/health
```

Stop the containers with:

```bash
docker compose down
```

### Database Persistence

The Docker deployment uses the named volume:

```text
sqlite_data
```

The SQLite database is stored in this persistent volume rather than inside the disposable API container.

As a result, database records remain available when the containers are stopped, removed and recreated with:

```bash
docker compose down
docker compose up -d
```

Using `docker compose down -v` will also remove the named volume and should only be used when the stored Docker database is intentionally being deleted.

## AWS Academy EC2 Deployment

The Dockerised application was deployed and tested on an AWS Academy EC2 instance running Amazon Linux 2023.

The deployment process was:

1. Launch an Amazon Linux 2023 EC2 instance.
2. Configure SSH access.
3. Install Git and Docker Engine.
4. Install Docker Compose.
5. Clone the GitHub repository.
6. Build the Docker images.
7. Start the services using Docker Compose.
8. Configure the EC2 security group for the required application ports.
9. Verify the frontend, API, health endpoint and database-backed functionality.

The application is started on EC2 from the repository directory using:

```bash
docker compose build
docker compose up -d
```

Container status can be checked using:

```bash
docker compose ps
```

The backend can be tested from the EC2 instance using:

```bash
curl http://localhost:4000/health
```

The frontend can be tested using:

```bash
curl -I http://localhost:3000
```

The EC2 security group used for the deployment permits:

- TCP port `22` for SSH administration
- TCP port `3000` for the frontend
- TCP port `4000` for the backend API and health endpoint

SSH access should be restricted to the administrator's IP address.

## Accessibility and Interface

The application includes accessibility and usability features such as:

- Light and dark themes
- Persistent theme preference
- Responsive layouts
- Keyboard-accessible controls
- Descriptive labels
- Optional phoneme hints
- Visual activity feedback
- Keyboard-accessible Word Search interaction

## Assessment 2 Functionality

The Assessment 2 version extends the original frontend activity builder with:

- Separate backend API
- SQLite database persistence
- Prisma ORM
- CRUD management for words
- CRUD management for word lists
- CRUD management for activities
- Database-driven Wordle generation
- Database-driven Word Search generation
- Server-side validation and error handling
- Standalone HTML activity generation
- Docker containerisation
- Persistent Docker database storage
- AWS Academy EC2 deployment
- `/health` endpoint

The activity generation workflow is:

```text
Saved Activity
      |
      v
Linked Word List
      |
      v
Stored Database Words
      |
      v
Wordle / Word Search
      |
      v
Standalone HTML Activity
```

This ensures generated activities use teacher-managed database content rather than fixed example data.

## Creator

**Name:** Jessuah Pender  
**Student Number:** 22442827

## Assessment Project

This project was developed as part of CSE3CWA coursework and extends the original frontend activity builder with backend API functionality, database persistence, CRUD management, database-driven activity generation, Docker containerisation and AWS deployment.

## GitHub Repository

The source code for this project is available at:

https://github.com/Icymoptop1/Phoneme-builder-jp