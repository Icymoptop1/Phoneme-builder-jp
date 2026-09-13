# Phoneme Learning Activity Builder

The Phoneme Learning Activity Builder is a full-stack educational web application designed to allow teachers to create and manage phoneme-based Wordle and Word Search learning activities.

The application was developed using Next.js, React, TypeScript, Prisma and SQLite. Activity content is stored in a database and accessed through server-side API routes, allowing teachers to create reusable words, word lists and activity configurations.

## Project Features

### Phoneme Words

Teachers can create, view, update and delete phoneme words.

Each stored word contains:

- An English word
- A phoneme sequence
- An optional hint
- Creation and update metadata

Phonemes are stored as sequences and may contain multi-character phoneme representations where required.

### Word Lists

Stored words can be organised into reusable word lists.

Teachers can:

- Create word lists
- Select stored words for a list
- View existing lists
- Update list details and contents
- Delete lists

Word lists provide the source content for Wordle and Word Search activities.

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

The target word is obtained from the database word list associated with the selected activity.

Difficulty affects the phoneme keyboard:

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
- Light and dark themes

### Standalone HTML Generation

Wordle and Word Search activities can be exported as standalone HTML files.

The generated files contain the required:

- HTML
- CSS
- JavaScript
- Phoneme data
- Activity configuration

This allows the generated learning activity to run directly in a normal web browser without requiring the main application to remain open.

## Technology Stack

The project uses:

- Next.js
- React
- TypeScript
- Prisma ORM
- SQLite
- Next.js Route Handlers
- HTML, CSS and JavaScript for standalone activity generation

## Application Structure

The main application is organised into the following areas:

```text
app/
├── api/
│   ├── activities/
│   ├── word-lists/
│   └── words/
├── about/
├── activities/
├── health/
├── settings/
├── word-lists/
├── word-search/
├── wordle/
├── words/
└── page.tsx

components/
lib/
prisma/
public/
```

The frontend communicates with Next.js server-side Route Handlers. These routes use Prisma to read and modify data stored in the SQLite database.

## API Routes

The application provides REST-style API routes for the main stored resources.

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

A successful health check returns a HTTP 200 response indicating that the application is running.

## Validation and Error Handling

Server-side validation is applied before data is stored in the database.

Validation includes:

- Required word and activity names
- Valid phoneme arrays
- Non-empty phoneme values
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

`WordListWord` provides the relationship between stored words and reusable word lists.

An `Activity` references a `WordList`, allowing stored word lists to drive generated activity content rather than relying on a single fixed example.

## Seed Data

The database includes a seed script containing 90 example phoneme words divided into:

- 3 Phoneme Words
- 4 Phoneme Words
- 5 Phoneme Words

This provides sample content while still allowing teachers to create and manage their own words and word lists.

## Getting Started

### Install Dependencies

From the project directory, run:

```bash
npm install
```

### Environment Configuration

The application requires a `DATABASE_URL` environment variable for SQLite.

The local `.env` configuration uses:

```text
DATABASE_URL="file:./dev.db"
```

### Prisma

Generate the Prisma client when required:

```bash
npx prisma generate
```

Apply database migrations when required:

```bash
npx prisma migrate dev
```

Seed the database with the supplied example phoneme data:

```bash
npx prisma db seed
```

### Run the Development Server

Start the application with:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The health endpoint can be checked at:

```text
http://localhost:3000/health
```

## Accessibility and Interface

The application includes accessibility and usability features such as:

- Light and dark themes
- Persistent theme preference
- Responsive layouts
- Keyboard-accessible controls
- Descriptive labels
- Optional phoneme hints
- Visual activity feedback

## Creator

**Name:** Jessuah Pender  
**Student Number:** 22442827

## Assessment Project

This project was developed as part of CSE3CWA coursework and extends the original frontend activity builder with database persistence, backend API functionality, CRUD management and database-driven activity generation.