# A2E-Student Information Dashboard

A full-stack student mentorship and scholarship platform with a React frontend and Express + Prisma API.

## Live Deployment URLs

- Frontend: https://a2edashboardinfo.vercel.app/students?page=1
- API: https://studentinformationdashboard.onrender.com/api/v1
- API Health: https://studentinformationdashboard.onrender.com/health

Note: The repository includes a verified production API URL in frontend/.env.production. A frontend live URL is not stored in this repository, so add your deployed Vercel URL before final submission.

## Run Locally (5-Minute Setup)

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally

## 1) Install dependencies

From project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2) Configure environment variables

Backend:

```bash
cd backend
cp .env.example .env
```

Frontend:

```bash
cd ../frontend
cp .env.example .env
```

Then update values as needed (see Environment Variables section below).

## 3) Prepare database

```bash
cd ../backend
npx prisma migrate dev --name init
npm run prisma:seed
```

## 4) Start backend

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:5000 by default.

## 5) Start frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173 by default.

## 6) Smoke check

- Open frontend and verify student directory loads.
- Call GET http://localhost:5000/health and confirm status OK.

## Environment Variables

## Backend (.env)

Required:

- DATABASE_URL: PostgreSQL connection string

Common defaults used in this project:

- PORT=5000
- NODE_ENV=development
- CORS_ORIGIN=http://localhost:3000 (or your frontend dev URL)
- API_PREFIX=/api
- API_VERSION=v1
- LOG_LEVEL=debug

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/student_db
CORS_ORIGIN=http://localhost:3000
API_PREFIX=/api
API_VERSION=v1
LOG_LEVEL=debug
```

## Frontend (.env)

Required:

- VITE_REACT_APP_API_URL: Base URL for API (for local: http://localhost:5000/api/v1)

Optional:

- VITE_REACT_APP_ENV=development
- VITE_REACT_APP_LOG_LEVEL=debug
- VITE_REACT_APP_ENABLE_ANALYTICS=false

Example:

```env
VITE_REACT_APP_API_URL=http://localhost:5000/api/v1
VITE_REACT_APP_ENV=development
VITE_REACT_APP_LOG_LEVEL=debug
VITE_REACT_APP_ENABLE_ANALYTICS=false
```

## Key Technical Decisions and Why

1. Service-layer backend architecture (routes -> controllers -> services)
Reason: Keeps HTTP concerns separated from business logic and makes testing/refactoring easier.

2. Prisma ORM with PostgreSQL
Reason: Strong schema management, migrations, and predictable relational queries for student/mentor/scholarship entities.

3. React with feature-organized components and custom API hooks
Reason: Reusable data-fetching logic (students, mentors, meetings, scholarships) and cleaner page components.

4. Centralized error handling and request validation
Reason: Consistent API error shape, safer input handling, and better debuggability.

5. Recharts-based data visualization
Reason: Lightweight charting for academic and scholarship insights without custom chart boilerplate.

## AI-Suggested vs Manual Overrides

AI-suggested and adopted:

- Base folder structure and layered backend architecture
- Initial REST endpoint patterns
- Initial error middleware structure
- Frontend hook-first data-fetching approach

AI-suggested but manually overridden/improved:

- Response shape enhanced with metadata/pagination for better frontend UX
- Error handling extended to include clearer, frontend-consumable error context
- Hook side effects improved with cleanup and safer async behavior
- Query patterns reviewed for performance and data-volume behavior

Where this collaboration is documented in detail:

- prompts.md (quality of AI collaboration)
- AI_REVIEW.md (self-awareness and critique)

## One Improvement With More Time

Complete and enforce resource-level authorization (RBAC + ownership checks) across all sensitive endpoints, then add integration tests for those access rules. This is the highest-impact remaining improvement for production readiness.

## Evaluation Checklist Mapping

- Working deployed product: API is live on Render, frontend URL should be added in this README.
- Quality of AI collaboration: documented in prompts.md.
- Self-awareness: documented in AI_REVIEW.md.
- Code quality and structure: layered backend and modular frontend organization.
- API design and validation: RESTful routes with centralized validation and error handling.
- UI polish and CSS craft: component-scoped styling across pages/components.
- Data visualization: implemented using Recharts.
- Error handling: centralized middleware on backend and global API error handling on frontend.
- README clarity: this document provides prerequisites, env vars, and a step-by-step run path.
