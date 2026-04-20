# A2E - Student Mentorship & Scholarship System

A comprehensive full-stack platform connecting students with mentors and scholarship opportunities.

## Project Overview

ABC is a full-stack application designed to:

- Connect Students with Mentors: Facilitate meaningful mentoring relationships
- Track Academic Progress: Monitor GPA, courses, and academic standing
- Manage Scholarships: Streamline application and approval processes
- Schedule Meetings: Coordinate mentor-student interactions with calendar integration
- Provide Analytics: Offer insights into platform usage and outcomes

Technology Stack:

- Backend: Node.js + Express.js + Prisma ORM + PostgreSQL
- Frontend: React + Vite + Axios
- Deployment: Vercel (frontend), Cloud hosting (backend)

## Live Deployment URLs

- Frontend: https://a2edashboardinfo.vercel.app/students?page=1
- API: https://studentinformationdashboard.onrender.com/api/v1
- API Health: https://studentinformationdashboard.onrender.com/health

## Run Locally (5-Minute Setup)

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

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

### 3) Prepare database

```bash
cd ../backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4) Start backend

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:5000 by default.

### 5) Start frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173 by default.

### 6) Smoke check

- Open frontend and verify student directory loads.
- Call GET http://localhost:5000/health and confirm status OK.

## Environment Variables

### Backend (.env)

Required:

- DATABASE_URL: PostgreSQL connection string

Common defaults used in this project:

- PORT=5000
- NODE_ENV=development
- CORS_ORIGIN=http://localhost:3000
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

### Frontend (.env)

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

## Architecture Decisions: AI-Suggested vs Manual Overrides

### 1. Project Structure & Folder Organization

Decision: Feature-Based Organization

AI-Suggested:

```text
backend/
|-- routes/
|-- controllers/
|-- services/
|-- middleware/
|-- models/
`-- utils/

frontend/
|-- components/
|-- pages/
|-- hooks/
|-- context/
|-- services/
`-- utils/
```

Rationale: Following MVC + service layer pattern  
Status: ADOPTED (No overrides needed)  
Why: This structure scales well, separates concerns clearly, and follows Node.js conventions.

### 2. Backend Architecture Pattern

Decision: MVC with Service Layer

AI-Suggested Pattern:

- Routes -> Handle HTTP requests and parameter validation
- Controllers -> Orchestrate business logic and call services
- Services -> Contain business logic, database operations
- Middleware -> Handle cross-cutting concerns (logging, error handling, auth)

Example Flow:

```text
POST /api/students
	↓
studentRoutes.js (route definition)
	↓
studentController.js (validate request, call service)
	↓
studentService.js (business logic, Prisma queries)
	↓
Database Response
```

Status: ADOPTED (No overrides needed)  
Why: Keeps code organized and testable. Services can be reused by controllers or other services.

### 3. Database Schema & Relationships

Decision: Normalized Schema with Prisma ORM

AI-Suggested:

```prisma
model User {
	id          String    @id @default(cuid())
	email       String    @unique
	password    String
	role        String    // 'Student', 'Mentor', 'Admin'
	createdAt   DateTime  @default(now())
}

model Student {
	id          String    @id @default(cuid())
	userId      String    @unique
	user        User      @relation(fields: [userId], references: [id])
	gpa         Float
	major       String
	mentorId    String?
	mentor      Mentor?   @relation(fields: [mentorId], references: [id])
}

model Mentor {
	id          String    @id @default(cuid())
	userId      String    @unique
	user        User      @relation(fields: [userId], references: [id])
	expertise   String[]
	students    Student[]
}
```

Manual Override Applied:

```prisma
// ADDED: Academic progress tracking
model AcademicProgress {
	id          String    @id @default(cuid())
	studentId   String
	student     Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
	semester    String
	gpa         Float
	coursesCompleted  Int
	recordedAt  DateTime  @default(now())
}

// ADDED: Scholarship applications tracking
model ScholarshipApplication {
	id            String    @id @default(cuid())
	studentId     String
	student       Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
	scholarshipId String
	scholarship   Scholarship @relation(fields: [scholarshipId], references: [id])
	status        String    // 'Pending', 'Approved', 'Rejected'
	appliedAt     DateTime  @default(now())
	decidedAt     DateTime?
}
```

Rationale for Override:

- AI schema was solid but lacked audit trail for historical data
- Added AcademicProgress to track GPA changes over time (not just current GPA)
- Added ScholarshipApplication to maintain complete application history and decision tracking

Status: PARTIALLY OVERRIDDEN  
Why: Historical data tracking is critical for analytics and compliance.

### 4. API Design & Endpoint Structure

Decision: RESTful API with Standardized Responses

AI-Suggested:

- Endpoint naming: /api/students, /api/mentors, /api/scholarships
- HTTP methods: GET, POST, PUT, DELETE
- Standard response format with status codes

Example Endpoint Structure:

```text
GET    /api/students            -> List all students (with filters)
POST   /api/students            -> Create new student
GET    /api/students/:id        -> Get student details
PUT    /api/students/:id        -> Update student
DELETE /api/students/:id        -> Delete student

GET    /api/students/:id/meetings       -> Get student's meetings
POST   /api/students/:id/scholarships   -> List scholarships for student
```

Manual Override Applied:

```json
{
	"statusCode": 200,
	"success": true,
	"message": "Students retrieved successfully",
	"data": [{ "id": "..." }],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 150,
		"pages": 8
	},
	"timestamp": "2026-04-20T10:30:00Z"
}
```

Status: PARTIALLY OVERRIDDEN  
Why: Pagination metadata helps frontend implement infinite scroll/pagination controls effectively.

### 5. Error Handling Strategy

Decision: Centralized Error Middleware with Custom Error Codes

AI-Suggested:

```javascript
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal server error';

	res.status(statusCode).json({
		statusCode,
		message,
		error: process.env.NODE_ENV === 'development' ? err : {}
	});
});
```

Manual Override Applied:

```javascript
const errorCodes = {
	VALIDATION_ERROR: 'VAL001',
	UNAUTHORIZED: 'AUTH001',
	FORBIDDEN: 'AUTH002',
	NOT_FOUND: 'NOT001',
	DUPLICATE_EMAIL: 'DUP001',
	SCHOLARSHIP_DEADLINE_PASSED: 'SCH001',
	INVALID_MEETING_TIME: 'MTG001'
};

app.use((err, req, res, next) => {
	const errorCode = err.errorCode || 'INTERNAL_ERROR';
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		statusCode,
		errorCode,
		message: err.message,
		requestId: req.id,
		details: process.env.NODE_ENV === 'development' ? err.details : {}
	});
});
```

Status: ADOPTED WITH ENHANCEMENTS  
Why: Error codes allow frontend to show specific, contextual error messages to users.

### 6. Frontend State Management

Decision: React Context API (Not Redux)

AI-Suggested:

```javascript
export const AuthContext = createContext();
export const LoadingContext = createContext();
export const ErrorContext = createContext();
```

Rationale:

- Simpler than Redux for this project scale
- Built-in to React, no external dependencies
- Sufficient for our data flow complexity

Manual Override Applied:

```javascript
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};

export const useStudents = (filters) => {
	const { loading, error, data } = useFetchData('/api/students', filters);
	return { loading, error, students: data };
};
```

Status: ADOPTED WITH CUSTOM HOOKS  
Why: Keeps components clean and data fetching logic reusable.

### 7. Authentication & Authorization

Decision: JWT Tokens with Role-Based Access Control

AI-Suggested:

```javascript
{
	userId: "123",
	email: "student@example.com",
	role: "Student"
}

async function authenticate(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'No token' });

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch {
		res.status(401).json({ error: 'Invalid token' });
	}
}
```

Manual Override Applied (CRITICAL):

```javascript
async function authorize(requiredRoles) {
	return async (req, res, next) => {
		const user = req.user;

		if (requiredRoles && !requiredRoles.includes(user.role)) {
			return res.status(403).json({ error: 'Insufficient permissions' });
		}

		if (req.params.studentId && user.role === 'Student') {
			if (user.id !== req.params.studentId) {
				return res.status(403).json({ error: 'Cannot access other student data' });
			}
		}

		if (req.params.mentorId && user.role === 'Mentor') {
			if (user.id !== req.params.mentorId) {
				return res.status(403).json({ error: 'Unauthorized' });
			}
		}

		next();
	};
}
```

Status: PARTIALLY OVERRIDDEN - INCOMPLETE  
Why: AI-suggested basic RBAC, but resource ownership checks are critical for security.  
Known Issue: See AI_REVIEW.md for ongoing security gaps.

### 8. Frontend Component Architecture

Decision: Functional Components with Hooks

AI-Suggested:

```javascript
function StudentList({ filters }) {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStudents(filters);
	}, [filters]);

	return (
		<div>
			{loading ? <Spinner /> : students.map(s => <StudentCard key={s.id} student={s} />)}
		</div>
	);
}
```

Manual Override Applied:

```javascript
function useStudentList(filters) {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		studentService.list(filters, { signal: controller.signal })
			.then(data => {
				setStudents(data);
				setError(null);
			})
			.catch(err => {
				if (err.name !== 'AbortError') {
					setError(err.message);
				}
			})
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [filters]);

	return { students, loading, error };
}

function StudentList({ filters }) {
	const { students, loading, error } = useStudentList(filters);

	if (error) return <ErrorMessage message={error} />;
	if (loading) return <Spinner />;
	return students.map(s => <StudentCard key={s.id} student={s} />);
}
```

Status: PARTIALLY OVERRIDDEN  
Why:

- Custom hooks improve reusability and testability
- Abort signals prevent race conditions and memory leaks
- Cleanup functions are essential for production stability

### 9. Database Query Optimization

Decision: Query Optimization & Caching

AI-Suggested (Basic):

```javascript
const mentors = await prisma.mentor.findMany({
	include: { students: true }
});
```

Manual Override Applied:

```javascript
const mentors = await prisma.mentor.findMany({
	where: { isActive: true },
	select: {
		id: true,
		name: true,
		expertise: true,
		_count: { select: { students: true } }
	},
	take: 20,
	skip: (page - 1) * 20
});

prisma.mentor.findMany({
	where: {
		expertise: { hasSome: ['JavaScript'] },
		isActive: true
	}
	// Requires: CREATE INDEX ON mentor(expertise, isActive)
});
```

Status: PARTIALLY OVERRIDDEN  
Why: AI generated working code but not optimized for scale. Added indexes and pagination.

### 10. Monitoring & Logging

Decision: Structured Logging with Request IDs

AI-Suggested:

```javascript
function logger(req, res, next) {
	console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
	next();
}
```

Manual Override Applied:

```javascript
function logger(req, res, next) {
	const requestId = generateUUID();
	req.id = requestId;

	const start = Date.now();

	console.log(JSON.stringify({
		timestamp: new Date().toISOString(),
		level: 'INFO',
		requestId,
		method: req.method,
		path: req.path,
		userId: req.user?.id,
		action: 'REQUEST_START'
	}));

	res.on('finish', () => {
		console.log(JSON.stringify({
			timestamp: new Date().toISOString(),
			level: 'INFO',
			requestId,
			method: req.method,
			path: req.path,
			statusCode: res.statusCode,
			duration: Date.now() - start,
			action: 'REQUEST_END'
		}));
	});

	next();
}
```

Status: ADOPTED WITH ENHANCEMENTS  
Why: Structured logs enable proper monitoring, debugging, and audit trails.

## Summary Table: Architectural Decisions

| Component | AI-Suggested | Status | Override Reason |
|-----------|--------------|--------|-----------------|
| Folder Structure | MVC + Services | Adopted | No changes needed |
| API Design | RESTful endpoints | Enhanced | Added pagination metadata |
| Database Schema | Normalized Prisma | Enhanced | Added audit/history tables |
| Error Handling | Centralized middleware | Enhanced | Added error codes |
| State Management | React Context | Adopted | Sufficient for scope |
| Auth/RBAC | JWT + role checks | Incomplete | Missing resource-level checks |
| Components | Functional + Hooks | Enhanced | Extracted to custom hooks |
| Query Optimization | Basic queries | Enhanced | Added indexing, pagination |
| Logging | Basic console logs | Enhanced | Structured JSON logs |

Legend:

- Adopted: No overrides, works as intended
- Enhanced: AI provided foundation, manual improvements applied
- Incomplete: Gaps remain, should be addressed before production

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

## AI-Suggested vs Your Overrides

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

Collaboration evidence:

- prompts.md: quality of AI collaboration
- AI_REVIEW.md: self-awareness and critique

## Known Limitations & Future Improvements

1. Authorization Gaps (see AI_REVIEW.md)
- Resource-level access controls are incomplete
- Recommended implementation before public launch

2. Real-time Features Not Implemented
- WebSockets for instant notifications not yet added
- Current implementation uses polling for updates

3. Analytics Dashboard
- Basic reporting available
- Advanced analytics (trends, predictions) not implemented

4. Mobile Optimization
- Responsive design implemented
- Native mobile app not developed

## One Thing to Improve With More Time

Complete and enforce resource-level authorization (RBAC + ownership checks) across all sensitive endpoints, then add integration tests for access rules. This is the highest-impact improvement for production readiness.

## How to Extend

### Adding a New Feature

1. Create service with business logic: src/services/newService.js
2. Create controller: src/controllers/newController.js
3. Add routes: src/routes/newRoutes.js
4. Add to main router: src/routes/index.js
5. Add corresponding React components and hooks
6. Update Prisma schema if data model changes

### Database Migration

```bash
npx prisma migrate dev --name feature_description
```

### Deployment

See backend and frontend package.json scripts for build and deploy commands.

## Evaluation Checklist Mapping

- Working deployed product: Frontend (Vercel) and API (Render) are live.
- Quality of AI collaboration (PROMPTS.md): covered in prompts.md.
- Self-awareness (AI_REVIEW.md): covered in AI_REVIEW.md.
- Code quality and structure: layered backend and modular frontend organization.
- API design and data validation: RESTful routes with centralized validation and error handling.
- UI polish, accessibility, and CSS craft: component-scoped styles with responsive pages.
- Data visualization implementation: implemented using Recharts.
- Error handling (not an afterthought): centralized backend middleware and frontend API error handling.
- README clarity (run in 5 minutes): includes prerequisites, env vars, and exact local startup steps.

## Conclusion

This project demonstrates effective AI-assisted development with critical human oversight. The AI excelled at architecture and organization, while manual overrides were essential for security, performance, and production readiness. The hybrid approach yielded a solid foundation that balances rapid development with code quality.
