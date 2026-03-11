Mentora Backend is a simplified backend service for a **mentorship platform** where **parents, students, and mentors interact**.
Parents can register their children, mentors can create lessons, and parents can book those lessons for their students.

This project demonstrates a clean backend architecture with authentication, role-based access control, and relational data management.

---

# Tech Stack

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework for building APIs
* **PostgreSQL** – Relational database
* **Prisma ORM** – Database access layer
* **JWT** – Authentication
* **bcrypt** – Password hashing

---

# Prerequisites

Make sure you have the following installed before running the project:

* **Node.js** (v18 or higher)
* **PostgreSQL**

---

# Project Setup

### 1. Install Dependencies

Clone the repository and install the required packages.

```bash
npm install
```

---

### 2. Configure Environment Variables

Copy the example environment file and update the values.

```bash
cp .env.example .env
```

Environment variables used in this project:

| Variable                   | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| PORT                      | Server port (default: 3000)                                |
| NODE_ENV                  | development or production                                  |
| JWT_SECRET                | Secret key used to sign JWT tokens                          |
| DATABASE_URL              | PostgreSQL connection string                               |
| DEFAULT_STUDENT_PASSWORD  | Password set for new students created by parents (required for POST /students) |
| OPENAI_API_KEY            | OpenAI API key (required for LLM summarize)                 |

Example `.env` file:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://localhost:5432/mentora
DEFAULT_STUDENT_PASSWORD=change-this-secure-password
OPENAI_API_KEY=your-openai-api-key
```

---

### 3. Setup the Database

Make sure PostgreSQL is running and create the database.

Then run the Prisma migrations:

```bash
npx prisma migrate dev
```

This will:

* create the database tables
* apply schema migrations
* generate the Prisma client

---

### 4. Run the Server

**`npm start`** – Runs `node src/app.js`. Starts the server once. Use for production or a single run. If you change code, you must stop and run it again to see changes.

**`npm run dev`** – Runs `nodemon src/app.js`. Nodemon watches your files and restarts the server when you save. Use for local development so you don’t have to restart manually.

```bash
npm start
```

Or, for development with automatic reload:

```bash
npm run dev
```

The server will start at:

```
http://localhost:3000
```

---

# Authentication

Authentication is handled using **JWT tokens**.

After login or signup, the server returns a token that must be included in requests:

```
Authorization: Bearer <token>
```

Only **parents** and **mentors** can create accounts.
Students are created by parents.

---

# API Overview

Base URL:

```
http://localhost:3000
```

---

# Authentication APIs

### Signup

```
POST /auth/signup
```

Registers a new **parent or mentor**.

Example request (use uppercase `PARENT` or `MENTOR` for `role`):

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "John",
  "role": "PARENT"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John",
    "role": "PARENT"
  }
}
```

---

### Login

```
POST /auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

---

### Get Current User

```
GET /auth/me
```

Returns the authenticated user's information. (The task refers to this as "GET /me"; it is implemented at `/auth/me`.)

---

# Student APIs (Parent Only)

Parents can register their children as students.

### Create Student

```
POST /students
```

Example request:

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

The student is automatically linked to the authenticated parent.

---

### List Students

```
GET /students
```

Returns all students belonging to the logged-in parent.

---

# Lesson APIs (Mentor Only)

Mentors can create lessons for students.

### Create Lesson

```
POST /lessons
```

The mentor is taken from the JWT (authenticated user); do not send `mentorId` in the body.

Example request:

```json
{
  "title": "Math 101",
  "description": "Introduction to algebra"
}
```

---

### Get Lesson Details

```
GET /lessons/:id
```

Returns details of a specific lesson.

---

### Get Lesson Sessions

```
GET /lessons/:id/sessions
```

Returns all sessions for a lesson.

---

# Booking API (Parent Only)

Parents can book lessons for their students.

### Create Booking

```
POST /bookings
```

Example request:

```json
{
  "studentId": 1,
  "lessonId": 1
}
```

Use the student's **user id** as `studentId` (the `id` returned from `GET /students` or `POST /students`).

Rules:

* The student must belong to the authenticated parent.
* Duplicate bookings are not allowed.

---

# Session API (Mentor Only)

Mentors can create sessions for lessons they own.

### Create Session

```
POST /sessions
```

Example request:

```json
{
  "lessonId": 1,
  "date": "2025-03-15T10:00:00Z",
  "topic": "Linear equations",
  "summary": "Covered basic concepts"
}
```

---

# LLM Summarization (Add-on)

The backend can summarize text via an external LLM (OpenAI).

### Set the API key

Do **not** hardcode the API key. Set it in your environment:

```bash
# In .env
OPENAI_API_KEY=sk-your-openai-api-key
```

### Summarize text

```
POST /llm/summarize
```

Request body:

```json
{
  "text": "Your longer text to summarize here..."
}
```

Response:

```json
{
  "summary": "• Point one\n• Point two\n...",
  "model": "gpt-4o-mini"
}
```

**Validation:**

* **400** – `text` is missing, empty, or too short (minimum 50 characters).
* **413** – `text` is too long (maximum 10,000 characters).

**Protection:** The endpoint uses a simple rate limit (e.g. 10 requests per minute per IP). If the LLM call fails, the API returns **502** or **500** with a clean error message.

**Example curl:**

```bash
curl -X POST http://localhost:3000/llm/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your paragraph or article text that is at least 50 characters long goes here. The API will return a concise summary in a few bullet points or a short paragraph."}'
```

**Assumptions:** Summary format is 3–6 bullet points or a short paragraph (max ~120 words). The LLM provider is configured via `OPENAI_API_KEY`; no API key is stored in the repository.

---

# Error Responses

The API returns standard HTTP error codes.

| Code | Meaning                      |
| ---- | ---------------------------- |
| 400  | Validation error             |
| 401  | Unauthorized / invalid token |
| 403  | Forbidden                    |
| 404  | Resource not found           |
| 409  | Conflict (duplicate booking) |
| 500  | Internal server error        |

Example error response:

```json
{
  "error": "message"
}
```

---

# Project Structure

```
src
│
├── config
│   └── Database and app configuration
│
├── middleware
│   └── Authentication and role validation
│
├── modules
│   ├── auth
│   ├── student
│   ├── lesson
│   ├── booking
│   ├── session
│   └── llm
│
└── utils
    └── JWT helpers

prisma
├── schema.prisma
└── migrations
```
