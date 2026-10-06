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
- `UsageRecord`

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

## Assessment 3 Functionality

Assessment 3 extends the database-driven activity builder with monitoring, reporting, observability, automated testing and accessibility evaluation.

The application now records operational and usage information in the database and presents this information through a dedicated dashboard.

### Monitoring Dashboard

The application includes a data-driven dashboard available at `/dashboard`.

The dashboard retrieves stored metrics from the backend and displays:

- Total stored words
- Total word lists
- Total activities
- Number of Wordle activities
- Number of Word Search activities
- Total activity generations
- Successful generations
- Failed generations
- Generation success rate
- Wordle generation count
- Word Search generation count
- Most-used activity type
- Average time spent on activity pages
- Number of recorded page sessions
- Number of empty word lists
- Recent usage and monitoring records

Dashboard information is calculated from database records rather than hard-coded values.

### Usage and Observability Data

Assessment 3 introduces the `UsageRecord` database model.

Usage records can store:

- Activity type
- Event type
- Generation result
- Page duration
- Related activity ID
- Monitoring message
- Creation timestamp

The supported usage event types are `PAGE_VIEW`, `PAGE_TIME` and `GENERATION`.

Generation records can contain a result of `SUCCESS` or `FAILED`.

This allows application behaviour to be recorded and used for operational reporting.

### Usage Tracking API

The backend provides:

- `GET /api/usage`
- `POST /api/usage`

`POST /api/usage` stores usage and monitoring events. The route validates supplied activity types, event types, generation results, durations and activity references before records are stored.

`GET /api/usage` provides recent stored usage records.

### Metrics API

Dashboard reporting is provided through `GET /api/metrics`.

The metrics API calculates database-backed information including:

- Stored word, word list and activity totals
- Wordle and Word Search activity totals
- Successful and failed generation totals
- Generation usage by activity type
- Most-used activity type
- Average recorded page time
- Recorded page sessions
- Empty word lists
- Recent usage records

The endpoint also reports application monitoring status.

### Activity Generation Tracking

Wordle and Word Search HTML generation is instrumented through the usage API.

Successful generation creates a `GENERATION` record with a `SUCCESS` result.

Failed generation creates a `GENERATION` record with a `FAILED` result and an associated monitoring message.

This allows generation reliability to be displayed on the dashboard.

### Page-Time Tracking

The Wordle and Word Search pages record approximate page-session duration.

When a recorded activity page session ends, a `PAGE_TIME` usage record is stored with its duration in milliseconds.

These records are used to calculate the average time-on-page metric displayed on the dashboard.

### Operational Alerts

The dashboard provides visible operational warnings.

Current monitoring includes:

- Failed activity generations
- Empty stored word lists

Failed generations are displayed as warning conditions so that generation problems are visible without inspecting raw database records.

Empty word lists are detected directly from stored database relationships and displayed as a warning because they may prevent useful activity generation.

Normal conditions are displayed separately from warning conditions.

### Simulated Usage Data

The Prisma seed process includes reproducible simulated usage records for reporting and observability testing.

The simulated records include:

- Successful Wordle generation
- Successful Word Search generation
- Failed Wordle generation
- Wordle page-time record
- Word Search page-time record

The simulated usage seed is idempotent and checks for existing simulated records before inserting them again.

This provides predictable dashboard data while still allowing real usage events to be recorded during application use.

## Assessment 3 Testing

### Playwright End-to-End Testing

Playwright is used for automated browser-based end-to-end testing.

The test suite contains two main workflows.

#### Builder Workflow

The Word List test verifies that a teacher can:

1. Open the Word List management page.
2. Create a word list.
3. Edit the word list.
4. Verify the updated information.
5. Delete the test word list.

The test cleans up the temporary record after execution.

#### User Workflow

The Wordle test verifies that:

1. The Wordle page loads.
2. A saved database activity is available.
3. A target word is loaded.
4. The Wordle preview is displayed.
5. The phoneme keyboard is displayed.
6. Standalone HTML generation can be triggered.
7. A successful Wordle generation record is stored through the usage API.

During Playwright testing, an activity-loading issue was identified on the Wordle page. The page was updated so saved Wordle activities are loaded when the page opens.

The completed Playwright suite passed with:

- `2 passed`
- `0 failed`

The Playwright configuration and tests are stored in:

- `frontend/playwright.config.ts`
- `frontend/tests/word-lists.spec.ts`
- `frontend/tests/wordle.spec.ts`

### JMeter Load Testing

Apache JMeter was used to test application behaviour under increasing request loads.

The load test exercises:

- `GET /wordle`
- `GET /api/activities`
- `GET /api/metrics`

The JMeter test plan is stored at:

- `tests/jmeter/phoneme-builder-load-test.jmx`

The staged local load tests produced the following results:

|   Load Level   |   Samples  | Average Response | Maximum Response | Error Rate |
|----------------|-----------:|-----------------:|-----------------:|-----------:|
|     x1         |    3       |      240 ms      |       544 ms     |    0.00%   |
|     x10        |    30      |      20 ms       |       41 ms      |    0.00%   |
|     x100       |    300     |      20 ms       |       54 ms      |    0.00%   |
|     x1000      |    3,000   |      5,623 ms    |       14,701 ms  |    0.00%   | 
| Extreme stress |    300,000 |      929 ms      |       44,773 ms  |    92.16%  |

The x10 and x100 stages remained responsive with no request errors.

At x1000 load, requests still completed without errors, but average response time increased substantially. This demonstrates performance degradation under heavy concurrent load.

The extreme stress test exceeded the practical capacity of the locally hosted application and produced a 92.16% error rate. The lower reported average response time at this stage does not represent improved performance because many requests failed quickly.

These results demonstrate the difference between normal operating load, degraded performance and system overload.

### Lighthouse Accessibility Testing

Chrome Lighthouse was used to evaluate the accessibility of the Dashboard and Wordle pages.

The Dashboard achieved:

- Accessibility score: `100`
- Passed automated audits: `20`
- Automated accessibility failures: `0`

The Wordle page achieved:

- Accessibility score: `100`
- Passed automated audits: `21`
- Automated accessibility failures: `0`

Lighthouse also identified manual accessibility checks that should still be considered because automated testing cannot verify every accessibility requirement.

The saved Lighthouse reports are stored at:

- `tests/lighthouse/dashboard-accessibility.html`
- `tests/lighthouse/wordle-accessibility.html`

## Assessment 3 Deployment Verification

The completed Assessment 3 application was rebuilt and deployed using Docker Compose on an AWS Academy EC2 instance running Amazon Linux 2023.

Deployment verification included:

- Frontend container running on port `3000`
- API container running on port `4000`
- Persistent SQLite Docker volume
- Prisma migration deployment
- Seed execution
- Dashboard loading from the deployed application
- Database-backed dashboard metrics
- Operational warning display
- Wordle saved activity loading
- Word Search saved activity loading
- `/health` returning HTTP `200 OK`

The health endpoint returns a status of `ok` and identifies the service as `phoneme-learning-activity-builder`.

The AWS deployment uses persistent Docker storage so application database data remains available when containers are rebuilt or recreated.

## Assessment 3 Data Flow

The reporting and observability workflow is:

Teacher / Student Interaction  
↓  
Wordle / Word Search  
↓  
Frontend Usage Tracking  
↓  
`POST /api/usage`  
↓  
`UsageRecord`  
↓  
SQLite Database  
↓  
`GET /api/metrics`  
↓  
Monitoring Dashboard

This extends the original database-driven activity workflow with an observability layer that records application behaviour and converts stored usage data into operational information.

## Assessment 3 API Routes

Assessment 3 adds usage tracking and reporting endpoints to the existing backend API.

### Usage

- `GET /api/usage`
- `POST /api/usage`

The usage API stores and retrieves operational usage records including generation events and page-time information.

### Metrics

- `GET /api/metrics`

The metrics endpoint aggregates stored database information for the monitoring dashboard.

### Health

- `GET /health`

The health endpoint provides a lightweight operational check and returns HTTP `200` when the backend service is operating normally.

## Assessment 3 Database Changes

Assessment 3 extends the existing Prisma database schema with the `UsageRecord` model.

The primary database models are now:

- `Word`
- `WordList`
- `WordListWord`
- `Activity`
- `UsageRecord`

`WordListWord` provides the many-to-many relationship between stored words and reusable word lists.

`Activity` references a `WordList`, allowing database-managed words to drive Wordle and Word Search activities.

`UsageRecord` stores operational events used by the monitoring and reporting functionality.

Usage records can be associated with an activity and can contain an activity type, event type, result, duration, monitoring message and timestamp.

The schema also includes the `UsageEventType` and `UsageResult` enums used to classify monitoring records.

A Prisma migration is included for the Assessment 3 usage metrics schema changes.

## Assessment 3 Repository Additions

Assessment 3 introduces the following important files and directories:

- `api/app/api/usage/route.ts` - usage tracking API
- `api/app/api/metrics/route.ts` - dashboard metrics API
- `api/prisma/migrations/20261005090850_add_usage_metrics/` - usage metrics database migration
- `frontend/app/dashboard/page.tsx` - monitoring dashboard
- `frontend/app/dashboard/dashboard.module.css` - dashboard styling
- `frontend/playwright.config.ts` - Playwright configuration
- `frontend/tests/word-lists.spec.ts` - builder workflow end-to-end test
- `frontend/tests/wordle.spec.ts` - Wordle user workflow end-to-end test
- `tests/jmeter/phoneme-builder-load-test.jmx` - JMeter load test plan
- `tests/lighthouse/dashboard-accessibility.html` - Dashboard Lighthouse report
- `tests/lighthouse/wordle-accessibility.html` - Wordle Lighthouse report

## Assessment 3 Verification Summary

The completed Assessment 3 implementation was verified using multiple testing approaches.

### Functional and End-to-End Verification

Playwright confirmed the Word List builder CRUD workflow and the Wordle activity generation workflow.

Final Playwright result:

- 2 tests passed
- 0 tests failed

### Performance Verification

JMeter testing showed that the application remained functional with no request errors through the x1000 staged load test, although substantial response-time degradation was observed at x1000.

The extreme stress test intentionally exceeded practical application capacity and produced a 92.16% error rate.

### Accessibility Verification

Lighthouse accessibility testing produced:

- Dashboard: `100`
- Wordle: `100`

No automated accessibility failures were reported on the tested pages, while manual accessibility checks remain relevant.

### Operational Verification

The backend `/health` endpoint returned HTTP `200 OK`.

The deployed dashboard successfully retrieved database-backed metrics and displayed generation health, activity usage, average page time, recent usage records and operational warnings.

### Deployment Verification

The completed application was successfully built and run using Docker Compose on AWS Academy EC2.

Both the frontend and API containers were confirmed as running, and the application was accessible through the deployed frontend.

## Assessment 3 Summary

Assessment 3 extends the original Phoneme Learning Activity Builder beyond activity creation and database persistence by introducing application observability and quality assurance.

The completed system now provides:

- Database-backed monitoring metrics
- Usage event persistence
- Wordle and Word Search generation tracking
- Successful and failed generation reporting
- Page-time tracking
- Most-used activity reporting
- Empty word list detection
- Operational dashboard warnings
- Reproducible simulated usage data
- Playwright end-to-end testing
- JMeter load and stress testing
- Lighthouse accessibility testing
- Backend health monitoring
- Docker-based AWS deployment verification

Together, these additions provide visibility into how the application is being used, whether activity generation is operating successfully, how the application behaves under increasing load, and whether key interfaces meet automated accessibility checks.

## Creator

**Name:** Jessuah Pender  
**Student Number:** 22442827

## Assessment Project

This project was developed as part of CSE3CWA coursework and extends the original frontend activity builder with backend API functionality, database persistence, CRUD management, database-driven activity generation, Docker containerisation and AWS deployment.

## GitHub Repository

The source code for this project is available at:

https://github.com/Icymoptop1/Phoneme-builder-jp