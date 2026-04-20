# Optimized Prompts Guide - Student Mentorship & Scholarship Platform

A comprehensive guide of optimized prompts for developing, testing, and maintaining the ABC platform.

---

## 1. PROJECT SETUP & INITIALIZATION

### Backend Setup
```
Initialize a Node.js backend with Express.js, Prisma ORM, and PostgreSQL. Create a basic project structure with separate folders for routes, controllers, services, middleware, config, and utils. Include .env file configuration and database connection setup.
```

### Frontend Setup
```
Set up a React frontend with Vite. Create a component-based architecture with separate folders for pages, components, services, hooks, context, and utilities. Implement API client with axios and configure environment variables for backend URLs.
```

### Database Schema
```
Design a Prisma schema for a student mentorship platform with models for Users, Students, Mentors, Scholarships, Meetings, and Applications. Include relationships, validation, and timestamps. Generate migrations and seed data.
```

---

## 2. BACKEND DEVELOPMENT


### Student Management API
```
Build RESTful endpoints for student management: GET all students with filters (major, year, academic status), GET student profile with details, POST create new student, PUT update student profile, DELETE student. Include pagination, sorting, and search functionality.
```

### Scholarship Management API
```
Develop scholarship endpoints: GET available scholarships with filters (amount, eligibility), POST apply for scholarship, GET application status, PUT update application status, DELETE remove application. Include deadline management and document upload.
```

### Meeting Scheduling API
```
Build meeting endpoints: POST schedule meeting between mentor and student, GET meeting history with filters (date range, participant), PUT update meeting details, DELETE cancel meeting. Include reminders and meeting notes.
```

### Error Handling & Validation
```
Implement centralized error handling middleware for consistent error responses. Add request validation for all endpoints using custom validators. Create custom error response format with status codes, error messages, and error codes.
```


---

## 3. FRONTEND DEVELOPMENT

### Navigation & Layout
```
Create a responsive navigation bar with user authentication status, profile dropdown, and navigation links to Students, Mentors, Scholarships, and Meetings pages. Include logout functionality and responsive design for mobile devices.
```

### Student Directory Page
```
Build a student directory page with: list view of all students, search functionality by name/major/year, filters for academic status and specialization, pagination for large datasets, click to view student profile, role-based visibility (mentors can see students, students can see peers).
```

### Student Profile Dashboard
```
Design a comprehensive student profile page showing: academic progress (GPA, courses, credits), assigned mentor information with contact options, upcoming meetings scheduled, available scholarships and application status, edit profile information button.
```

### Mentor Management Page
```
Create a mentor management interface displaying: list of available mentors with expertise tags, mentor ratings and mentee count, filter by expertise and availability, schedule meeting button, view mentor profile with bio and contact.
```

### Scholarship Management Page
```
Build a scholarship management system: display available scholarships with details (amount, eligibility criteria, deadline), apply for scholarship form with document upload, track application status, view scholarship history, deadline countdown.
```

### Meetings Page
```
Develop a meetings calendar/list page: display scheduled meetings with mentor/student, date, time, meeting notes, reschedule/cancel options, mark attendance, add meeting outcome notes, filter meetings by date range and participant.
```

### Context & Global State
```
Set up global state management using React Context for: loading state (show spinners during API calls), error state (display error messages), user authentication state (store user info, token, permissions).
```

### API Integration
```
Create custom hooks (useMeetings, useMentors, useScholarships, useStudents) that handle API calls, loading states, and error handling. Implement data fetching with proper cleanup, caching strategies, and error boundaries.
```

### Form Handling & Validation
```
Build reusable form components with client-side validation: student profile edit form, scholarship application form, meeting scheduling form. Include error messages, success notifications, and form reset functionality.
```

---

## 4. FEATURE IMPLEMENTATION

### Student-Mentor Assignment
```
Implement student-mentor matching system: students can request/filter mentors by expertise, mentors can accept/decline requests, admin can manually assign mentors, prevent duplicate assignments, handle mentor-student communication setup.
```

### Meeting Scheduling
```
Create meeting scheduling flow: student/mentor proposes time slots, availability checking, calendar integration, email reminders, meeting notes/outcome recording, reschedule/cancel options with notification.
```

### Scholarship Application Workflow
```
Build complete scholarship application process: student views available scholarships, applies with required documents, admin reviews applications, status updates (pending/approved/rejected), appeal mechanism, track all applications and outcomes.
```

### Academic Progress Tracking
```
Implement student academic progress monitoring: GPA calculation and history, courses taken and grades, credit hours completed, academic standing status (good/probation/dismissed), visual progress indicators and achievements.
```

### Notifications & Reminders
```
Set up notification system for: meeting reminders 24 hours before, scholarship deadline alerts, application status updates, mentor/mentee messages, important announcements, email and in-app notifications.
```

---

## 5. TESTING & DEBUGGING

### API Testing
```
Create Postman collection or similar for testing all API endpoints: test with valid/invalid data, verify error responses, check authentication and authorization, test pagination and filters, validate response formats, stress test with multiple concurrent requests.
```

### Frontend Component Testing
```
Write unit tests for critical components: StudentList component with filtering, MeetingScheduler component, ScholarshipForm validation, error boundary behavior, mock API responses with different scenarios.
```

### Integration Testing
```
Test complete user workflows: student registration → mentor assignment → meeting scheduling → scholarship application, test error scenarios (network failures, invalid data), verify data consistency between frontend and backend.
```

### Bug Reporting & Fixing
```
Document bugs with: clear reproduction steps, expected vs actual behavior, environment details (browser, OS, app version), screenshots/videos, priority level (critical/high/medium/low), assign to developer with context.
```

---

## 6. DEPLOYMENT & DEVOPS

### Backend Deployment
```
Deploy Node.js backend to production: use environment-specific configurations, set up database migrations for production, configure error monitoring and logging, set up CI/CD pipeline with automated testing, secure API keys and secrets.
```

### Frontend Deployment
```
Deploy React frontend to Vercel/similar: configure build process, set up environment variables for production API URLs, implement automatic deployments on code push, configure caching strategy, set up analytics and error tracking.
```

### Database Management
```
Set up production database: configure PostgreSQL with backups, implement data migration strategy, set up monitoring and performance optimization, create database user with limited permissions, test backup/restore procedures.
```

### Security Setup
```
Implement security best practices: HTTPS/SSL certificates, CORS configuration, rate limiting on API endpoints, input sanitization and SQL injection prevention, secure password storage, API key rotation, security headers.
```

---

## 7. MAINTENANCE & OPTIMIZATION

### Performance Optimization
```
Optimize application performance: implement database query optimization with indexing, add API response caching, optimize frontend bundle size, lazy load components and images, monitor and reduce API call volume, implement pagination and data virtualization.
```

### Code Quality & Refactoring
```
Improve code quality: conduct code reviews, refactor repetitive code into reusable utilities, standardize naming conventions, add code documentation and comments, implement linting rules, fix technical debt gradually.
```

### Analytics & Monitoring
```
Set up monitoring and analytics: track user engagement metrics, monitor API performance and error rates, set up alerts for critical errors or performance issues, collect user feedback, analyze usage patterns to identify improvement areas.
```

### Documentation
```
Maintain comprehensive documentation: API documentation with endpoint details and examples, frontend component documentation with props and usage, setup instructions for new developers, troubleshooting guide, deployment procedures.
```

---

## 8. ADVANCED FEATURES

### Real-time Notifications
```
Implement real-time features using WebSockets: instant meeting updates, live notification system, real-time chat between mentor and student, broadcast announcements, presence indicators showing who's online.
```

### Advanced Analytics Dashboard
```
Create admin analytics dashboard: total students/mentors count, scholarship statistics (applications, approvals), meeting analytics (average duration, frequency), platform usage trends, user retention metrics, performance reports.
```

### Reporting & Export
```
Add reporting capabilities: generate student academic reports, scholarship fund allocation reports, mentor performance reports, export data to CSV/PDF, scheduled report email delivery, custom report builder for admins.
```

### Mobile App Integration
```
Plan mobile app integration: create mobile-friendly responsive design, develop native mobile app using React Native, implement push notifications for mobile, sync data between web and mobile platforms.
```

---

## 9. TROUBLESHOOTING & COMMON ISSUES

### Authentication Issues
```
Debug authentication problems: verify JWT token expiration and refresh logic, check CORS configuration for auth endpoints, ensure password hashing is working correctly, test with different user roles, clear browser cookies and localStorage.
```

### API Connection Issues
```
Resolve API connectivity: verify backend is running and endpoint URLs are correct, check network tab for request/response, validate request payload format, check authentication headers, verify database connection, test with Postman.
```

### Data Consistency Issues
```
Fix data synchronization problems: verify database migrations completed successfully, check for race conditions in concurrent updates, ensure cache invalidation on data changes, validate data relationships in database, check for data type mismatches.
```

### Performance Issues
```
Optimize slow endpoints: check database query performance with EXPLAIN ANALYZE, add indexes to frequently queried fields, implement query result caching, reduce N+1 query problems, batch API requests, monitor memory usage.
```

---

## 10. BEST PRACTICES & CONVENTIONS

### Code Organization
```
Follow consistent code structure: organize files by feature/domain, separate business logic from presentation, use consistent naming conventions across codebase, implement single responsibility principle, keep files small and focused.
```

### API Design
```
Follow RESTful API conventions: use proper HTTP methods (GET, POST, PUT, DELETE, PATCH), use consistent URL naming (plural nouns, no verbs), return appropriate status codes, implement pagination for list endpoints, version API endpoints for backward compatibility.
```

### Git Workflow
```
Follow Git best practices: use feature branches with clear naming, write descriptive commit messages, use pull requests for code review, keep commits atomic and logical, squash commits before merging, use semantic versioning for releases.
```

### Communication & Collaboration
```
Improve team communication: document decisions in pull request descriptions, communicate blockers early, use issue tracking for bugs and features, maintain up-to-date documentation, conduct regular code review meetings, share knowledge through documentation.
```

---

## Quick Reference - Prompt Templates

### For Bug Fixes
```
I'm seeing a bug where [describe issue]. 
- Expected behavior: [what should happen]
- Actual behavior: [what's happening]
- Reproduction steps: [steps to reproduce]
- Environment: [browser/OS/app version]
Please debug and fix this issue.
```

### For Feature Development
```
Add [feature name] to [module/page]:
- Requirements: [list requirements]
- User flow: [describe workflow]
- Backend changes needed: [list changes]
- Frontend changes needed: [list changes]
- Test scenarios: [list test cases]
```

### For Performance Optimization
```
Optimize [specific area/component]:
- Current performance metric: [measured value]
- Target performance: [desired value]
- Bottleneck analysis: [identify issue]
- Optimization strategy: [approach to solve]
```

### For Code Review
```
Review this code for:
- Correctness: Does it do what's intended?
- Performance: Are there bottlenecks?
- Security: Are there vulnerabilities?
- Best practices: Does it follow conventions?
- Maintainability: Is it easy to understand and modify?
```

---

## Notes for Future Development

- Keep prompts specific and include context (module, feature, expected outcome)
- Update this guide as new patterns and best practices emerge
- Use these prompts as templates, adjust based on specific situation
- Include acceptance criteria when describing features
- Always provide examples or reference implementation when possible
