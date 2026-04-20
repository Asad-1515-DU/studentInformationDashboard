import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define courses by major (8 courses per major - 2 per year)
const coursesByMajor = {
  'Computer Science': [
    { code: 'CS101', name: 'Introduction to Programming', credits: 3, semester: 1 },
    { code: 'CS102', name: 'Data Structures', credits: 3, semester: 2 },
    { code: 'CS201', name: 'Algorithms', credits: 4, semester: 3 },
    { code: 'CS202', name: 'Database Systems', credits: 4, semester: 4 },
    { code: 'CS301', name: 'Web Development', credits: 3, semester: 5 },
    { code: 'CS302', name: 'Machine Learning', credits: 4, semester: 6 },
    { code: 'CS401', name: 'Software Engineering', credits: 3, semester: 7 },
    { code: 'CS402', name: 'Capstone Project', credits: 4, semester: 8 },
  ],
  'Engineering': [
    { code: 'ENG101', name: 'Engineering Mechanics', credits: 3, semester: 1 },
    { code: 'ENG102', name: 'Circuit Theory', credits: 3, semester: 2 },
    { code: 'ENG201', name: 'Thermodynamics', credits: 4, semester: 3 },
    { code: 'ENG202', name: 'Control Systems', credits: 4, semester: 4 },
    { code: 'ENG301', name: 'Signal Processing', credits: 3, semester: 5 },
    { code: 'ENG302', name: 'Power Systems', credits: 4, semester: 6 },
    { code: 'ENG401', name: 'Robotics', credits: 3, semester: 7 },
    { code: 'ENG402', name: 'Design Project', credits: 4, semester: 8 },
  ],
  'Business Administration': [
    { code: 'BUS101', name: 'Introduction to Business', credits: 3, semester: 1 },
    { code: 'BUS102', name: 'Financial Accounting', credits: 3, semester: 2 },
    { code: 'BUS201', name: 'Microeconomics', credits: 4, semester: 3 },
    { code: 'BUS202', name: 'Marketing Management', credits: 4, semester: 4 },
    { code: 'BUS301', name: 'Corporate Finance', credits: 3, semester: 5 },
    { code: 'BUS302', name: 'Strategic Management', credits: 4, semester: 6 },
    { code: 'BUS401', name: 'Entrepreneurship', credits: 3, semester: 7 },
    { code: 'BUS402', name: 'Business Capstone', credits: 4, semester: 8 },
  ],
  'Biology': [
    { code: 'BIO101', name: 'Cell Biology', credits: 3, semester: 1 },
    { code: 'BIO102', name: 'Genetics', credits: 3, semester: 2 },
    { code: 'BIO201', name: 'Molecular Biology', credits: 4, semester: 3 },
    { code: 'BIO202', name: 'Ecology', credits: 4, semester: 4 },
    { code: 'BIO301', name: 'Biochemistry', credits: 3, semester: 5 },
    { code: 'BIO302', name: 'Microbiology', credits: 4, semester: 6 },
    { code: 'BIO401', name: 'Research Methods', credits: 3, semester: 7 },
    { code: 'BIO402', name: 'Thesis', credits: 4, semester: 8 },
  ],
  'Psychology': [
    { code: 'PSY101', name: 'Introduction to Psychology', credits: 3, semester: 1 },
    { code: 'PSY102', name: 'Research Methods', credits: 3, semester: 2 },
    { code: 'PSY201', name: 'Cognitive Psychology', credits: 4, semester: 3 },
    { code: 'PSY202', name: 'Developmental Psychology', credits: 4, semester: 4 },
    { code: 'PSY301', name: 'Abnormal Psychology', credits: 3, semester: 5 },
    { code: 'PSY302', name: 'Social Psychology', credits: 4, semester: 6 },
    { code: 'PSY401', name: 'Advanced Research', credits: 3, semester: 7 },
    { code: 'PSY402', name: 'Capstone Seminar', credits: 4, semester: 8 },
  ],
};

// 20 Students - 5 per year
const studentData = [
  // Year 1 (5 students)
  { name: 'Alice Johnson', email: 'alice.johnson@student.com', major: 'Computer Science', year: 1 },
  { name: 'Bob Williams', email: 'bob.williams@student.com', major: 'Engineering', year: 1 },
  { name: 'Carol Davis', email: 'carol.davis@student.com', major: 'Business Administration', year: 1 },
  { name: 'David Miller', email: 'david.miller@student.com', major: 'Biology', year: 1 },
  { name: 'Emma Wilson', email: 'emma.wilson@student.com', major: 'Psychology', year: 1 },

  // Year 2 (5 students)
  { name: 'Frank Moore', email: 'frank.moore@student.com', major: 'Computer Science', year: 2 },
  { name: 'Grace Taylor', email: 'grace.taylor@student.com', major: 'Engineering', year: 2 },
  { name: 'Henry Anderson', email: 'henry.anderson@student.com', major: 'Business Administration', year: 2 },
  { name: 'Iris Thomas', email: 'iris.thomas@student.com', major: 'Biology', year: 2 },
  { name: 'Jack Jackson', email: 'jack.jackson@student.com', major: 'Psychology', year: 2 },

  // Year 3 (5 students)
  { name: 'Karen White', email: 'karen.white@student.com', major: 'Computer Science', year: 3 },
  { name: 'Leo Harris', email: 'leo.harris@student.com', major: 'Engineering', year: 3 },
  { name: 'Mia Martin', email: 'mia.martin@student.com', major: 'Business Administration', year: 3 },
  { name: 'Nathan Lopez', email: 'nathan.lopez@student.com', major: 'Biology', year: 3 },
  { name: 'Olivia Lee', email: 'olivia.lee@student.com', major: 'Psychology', year: 3 },

  // Year 4 (5 students)
  { name: 'Peter Walker', email: 'peter.walker@student.com', major: 'Computer Science', year: 4 },
  { name: 'Quinn Hall', email: 'quinn.hall@student.com', major: 'Engineering', year: 4 },
  { name: 'Rachel Young', email: 'rachel.young@student.com', major: 'Business Administration', year: 4 },
  { name: 'Samuel Green', email: 'samuel.green@student.com', major: 'Biology', year: 4 },
  { name: 'Tina Clark', email: 'tina.clark@student.com', major: 'Psychology', year: 4 },
];

// 5 Mentors
const mentorData = [
  { name: 'Dr. John Doe', email: 'john.doe@university.com', expertise: 'Computer Science & Programming', department: 'CS', phone: '+1-555-0101' },
  { name: 'Dr. Jane Smith', email: 'jane.smith@university.com', expertise: 'Engineering & Mechanics', department: 'Engineering', phone: '+1-555-0102' },
  { name: 'Prof. Michael Brown', email: 'michael.brown@university.com', expertise: 'Business & Finance', department: 'Business', phone: '+1-555-0103' },
  { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.com', expertise: 'Biology & Life Sciences', department: 'Biology', phone: '+1-555-0104' },
  { name: 'Prof. Robert Lee', email: 'robert.lee@university.com', expertise: 'Psychology & Human Behavior', department: 'Psychology', phone: '+1-555-0105' },
];

// 15 Scholarships
const scholarshipData = [
  { name: 'Merit Excellence Scholarship', amount: 5000, description: 'For outstanding academic performance (GPA 3.7+)' },
  { name: 'STEM Leadership Award', amount: 4500, description: 'For excellence in STEM fields' },
  { name: 'Business Innovation Grant', amount: 4000, description: 'For entrepreneurial projects' },
  { name: 'Need-Based Assistance', amount: 3000, description: 'For students with demonstrated financial need' },
  { name: 'First Generation Scholar', amount: 3500, description: 'For first generation students' },
  { name: 'International Student Fund', amount: 4000, description: 'For international scholars' },
  { name: 'Research Excellence Grant', amount: 5500, description: 'For research contributions' },
  { name: 'Athletic Excellence Award', amount: 2500, description: 'For student athletes' },
  { name: 'Community Service Scholarship', amount: 2500, description: 'For community engagement' },
  { name: 'Environmental Studies Fund', amount: 3500, description: 'For environmental projects' },
  { name: 'Arts & Humanities Award', amount: 3000, description: 'For arts students' },
  { name: 'Graduate Preparation Grant', amount: 4000, description: 'For students preparing for grad school' },
  { name: 'Tech Innovation Scholarship', amount: 4500, description: 'For tech innovations' },
  { name: 'Women in Engineering Award', amount: 4000, description: 'For women in engineering' },
  { name: 'Diversity Excellence Scholarship', amount: 3500, description: 'Promoting diversity in education' },
];

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await prisma.studentCourse.deleteMany({});
    await prisma.studentScholarship.deleteMany({});
    await prisma.meeting.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.deadline.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.scholarship.deleteMany({});
    await prisma.mentor.deleteMany({});
    console.log('🗑️  Cleared all existing data');

    // Create mentors
    const mentors = await Promise.all(
      mentorData.map((data) =>
        prisma.mentor.create({
          data: {
            name: data.name,
            email: data.email,
            expertise: data.expertise,
            department: data.department,
            phone: data.phone,
            availability: 'AVAILABLE',
            maxStudents: 15,
          },
        })
      )
    );
    console.log(`✅ Created ${mentors.length} mentors`);

    // Create scholarships
    const scholarships = await Promise.all(
      scholarshipData.map((data) =>
        prisma.scholarship.create({
          data: {
            name: data.name,
            amount: data.amount,
            description: data.description,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            status: 'ACTIVE',
            maxAwardees: 20,
          },
        })
      )
    );
    console.log(`✅ Created ${scholarships.length} scholarships`);

    // Create courses for each major
    const courses = [];
    for (const [major, majorCourses] of Object.entries(coursesByMajor)) {
      const createdCourses = await Promise.all(
        majorCourses.map((data) =>
          prisma.course.create({
            data: {
              code: data.code,
              name: data.name,
              credits: data.credits,
              semester: data.semester,
              major: major,
              description: `${data.name} for ${major} majors`,
            },
          })
        )
      );
      courses.push(...createdCourses);
    }
    console.log(`✅ Created ${courses.length} courses (8 per major × 5 majors)`);

    // Create students with progress records
    const students = [];
    let progressCount = 0;
    let studentCourseCount = 0;

    for (let i = 0; i < studentData.length; i++) {
      const data = studentData[i];
      const student = await prisma.student.create({
        data: {
          name: data.name,
          email: data.email,
          major: data.major,
          academicYear: data.year,
          dateOfBirth: new Date(`${1998 + (4 - data.year)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
          status: 'ACTIVE',
          phone: `+1-555-${2000 + i}`,
          address: `${Math.floor(Math.random() * 1000) + 1} Student Street, University City`,
          mentorId: mentors[i % mentors.length].id,
        },
      });
      students.push(student);

      // Create progress records - 2 per year (8 semesters for year 4, 6 for year 3, etc.)
      const currentYear = 2026;
      for (let year = 1; year <= data.year; year++) {
        const academicYear = currentYear - (data.year - year);

        // For each year, create 2 semester records
        for (let sem = 1; sem <= 2; sem++) {
          // Calculate semester number (1-8)
          const semesterNumber = (year - 1) * 2 + sem;

          // GPA calculation - shows improvement/decline patterns
          let baseGPA = 2.5 + Math.random() * 1.4; // 2.5-3.9 base
          const yearProgress = (year - 1) * 0.15; // Improves over years
          let gpa = Math.min(baseGPA + yearProgress, 4.0);
          
          // Add some variation - some students plateau or decline
          if (year > 2 && Math.random() > 0.6) {
            gpa -= Math.random() * 0.2;
          }
          gpa = Math.round(gpa * 100) / 100;

          // Determine status
          let status = 'ON_TRACK';
          if (gpa >= 3.7) status = 'EXCELLENT';
          else if (gpa >= 3.5) status = 'ON_TRACK';
          else if (gpa < 2.5) status = 'AT_RISK';

          const progress = await prisma.progress.create({
            data: {
              gpa: gpa.toString(),
              semester: sem,
              academicYear: academicYear,
              status: status,
              creditsEarned: 15 + Math.floor(Math.random() * 2),
              attendanceRate: 80 + Math.random() * 20,
              remarks: `${status === 'EXCELLENT' ? '🌟 Excellent performance' : status === 'AT_RISK' ? '⚠️ Needs improvement' : '✅ Good progress'} in semester ${sem}`,
              studentId: student.id,
            },
          });
          progressCount++;

          // Assign courses for this semester
          const majorCourses = coursesByMajor[data.major] || [];
          const semesterCourses = majorCourses.filter((c) => c.semester === semesterNumber);
          
          for (const course of semesterCourses) {
            const courseRecord = courses.find((c) => c.code === course.code);
            if (courseRecord) {
              // Grade mapping based on GPA
              let grade = 'C';
              if (gpa >= 3.9) grade = 'A';
              else if (gpa >= 3.7) grade = 'A-';
              else if (gpa >= 3.5) grade = 'B+';
              else if (gpa >= 3.3) grade = 'B';
              else if (gpa >= 3.0) grade = 'B-';
              else if (gpa >= 2.7) grade = 'C+';
              else if (gpa >= 2.4) grade = 'C';
              else grade = 'D';

              await prisma.studentCourse.create({
                data: {
                  studentId: student.id,
                  courseId: courseRecord.id,
                  semester: sem,
                  academicYear: academicYear,
                  grade: grade,
                  status: 'COMPLETED',
                },
              });
              studentCourseCount++;
            }
          }
        }
      }
    }
    console.log(`✅ Created ${students.length} students with academic records`);
    console.log(`   └─ ${progressCount} progress records (2 per semester per student)`);
    console.log(`   └─ ${studentCourseCount} student-course enrollments`);

    // Assign scholarships to students (80% get scholarships)
    let scholarshipCount = 0;
    for (let i = 0; i < students.length; i++) {
      if (Math.random() > 0.2) {
        const scholarship = scholarships[Math.floor(Math.random() * scholarships.length)];
        try {
          await prisma.studentScholarship.create({
            data: {
              studentId: students[i].id,
              scholarshipId: scholarship.id,
              awardedAmount: scholarship.amount,
              awardedDate: new Date('2026-01-15'),
              status: 'ACTIVE',
            },
          });
          scholarshipCount++;
        } catch (e) {
          // Ignore unique constraint violations
        }
      }
    }
    console.log(`✅ Assigned ${scholarshipCount} scholarships`);

    // Create meetings
    let meetingCount = 0;
    for (const student of students) {
      const mentor = mentors[Math.floor(Math.random() * mentors.length)];
      
      // Create 2-3 meetings per student
      const meetingsPerStudent = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < meetingsPerStudent; i++) {
        // Create meetings across a wider date range
        // Some in the past (March-April), some in the future (April-July)
        const monthOffset = Math.floor(Math.random() * 5); // 0-4 (March to July)
        const month = 2 + monthOffset; // March (2) to July (6)
        
        // For future meetings (May onwards), use days 21-28
        // For current/past meetings (March-April), use days 1-30 randomly
        let day;
        if (month >= 4) {
          // May and later - more likely to be in valid range
          day = Math.floor(Math.random() * 10) + 15; // Days 15-24
        } else {
          // March-April - use full range but bias towards later dates
          day = Math.floor(Math.random() * 28) + 1; // Days 1-28
        }
        
        const meetingDate = new Date(2026, month, day);
        
        const statusArray = ['SCHEDULED', 'COMPLETED', 'SCHEDULED', 'COMPLETED', 'SCHEDULED'];
        const status = statusArray[Math.floor(Math.random() * statusArray.length)];
        const notesList = [
          'Discussion on academic progress and career guidance',
          'Reviewed semester performance and set goals',
          'Discussed course selection for next semester',
          'Research project guidance and mentoring',
          'Preparation for final exams',
          'Career planning and internship opportunities',
          'Grade improvement strategies',
          'Scholarship application assistance'
        ];

        await prisma.meeting.create({
          data: {
            date: meetingDate,
            duration: 45 + Math.floor(Math.random() * 75),
            notes: notesList[Math.floor(Math.random() * notesList.length)],
            status: status,
            studentId: student.id,
            mentorId: mentor.id,
          },
        });
        meetingCount++;
      }
    }
    console.log(`✅ Created ${meetingCount} meetings`);

    // Create deadlines
    const deadlines = [
      { title: 'Spring Semester Registration', dueDate: new Date('2026-02-28'), category: 'ACADEMIC', priority: 'HIGH' },
      { title: 'Scholarship Application Deadline', dueDate: new Date('2026-03-31'), category: 'SCHOLARSHIP', priority: 'CRITICAL' },
      { title: 'Midterm Exams Begin', dueDate: new Date('2026-04-15'), category: 'ACADEMIC', priority: 'HIGH' },
      { title: 'Research Project Submission', dueDate: new Date('2026-05-30'), category: 'ACADEMIC', priority: 'MEDIUM' },
      { title: 'Final Exams', dueDate: new Date('2026-06-10'), category: 'ACADEMIC', priority: 'CRITICAL' },
      { title: 'Mentor Check-in Meeting', dueDate: new Date('2026-02-15'), category: 'MENTORSHIP', priority: 'MEDIUM' },
    ];

    await Promise.all(
      deadlines.map((data) =>
        prisma.deadline.create({
          data: {
            title: data.title,
            dueDate: data.dueDate,
            category: data.category,
            priority: data.priority,
            isCompleted: data.dueDate < new Date(),
          },
        })
      )
    );
    console.log(`✅ Created ${deadlines.length} deadlines`);

    // Update student GPAs and credits
    for (const student of students) {
      const progressRecords = await prisma.progress.findMany({
        where: { studentId: student.id },
        orderBy: { academicYear: 'desc' }
      });

      if (progressRecords.length > 0) {
        const avgGPA = progressRecords.reduce((sum, p) => sum + parseFloat(p.gpa), 0) / progressRecords.length;
        const majorGPA = progressRecords.slice(0, 4).reduce((sum, p) => sum + parseFloat(p.gpa), 0) / Math.min(4, progressRecords.length);
        const totalCredits = progressRecords.reduce((sum, p) => sum + (p.creditsEarned || 0), 0);
        const coursesCount = await prisma.studentCourse.count({
          where: { studentId: student.id }
        });

        await prisma.student.update({
          where: { id: student.id },
          data: {
            gpa: Math.round(avgGPA * 100) / 100,
            majorGPA: Math.round(majorGPA * 100) / 100,
            creditsCompleted: totalCredits,
            coursesCompleted: coursesCount,
          },
        });
      }
    }
    console.log('✅ Updated student GPAs and credit totals');

    console.log('\n' + '═'.repeat(70));
    console.log('✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨');
    console.log('═'.repeat(70));
    console.log(`
📊 SEEDING SUMMARY:
  ✓ 20 Students (5 per year: 1st, 2nd, 3rd, 4th year)
  ✓ 5 Mentors (specialized by department)
  ✓ 15 Scholarships (various criteria and amounts)
  ✓ 40 Courses (8 per major × 5 majors)
  ✓ 40 Progress Records (2 per year per student = 8 semesters max)
  ✓ ${meetingCount} Meetings (2-3 per student)
  ✓ ${studentCourseCount} Student-Course Enrollments
  ✓ 6 Academic Deadlines

📈 STUDENT PERFORMANCE TRACKING:
  ✓ Each student has semester-wise progress tracking
  ✓ Year 1: 2 semesters | Year 2: 4 semesters | Year 3: 6 semesters | Year 4: 8 semesters
  ✓ GPA trends show improvement or decline over time
  ✓ Progress status: EXCELLENT (3.7+), ON_TRACK (3.5-3.7), or AT_RISK (< 2.5)
  ✓ Related courses assigned by major and semester

🎓 DATA READY FOR:
  ✓ Performance trend visualization (line chart GPA vs semester)
  ✓ Semester-wise GPA comparison and analysis
  ✓ Course recommendation by major and academic year
  ✓ Scholarship and mentorship tracking
    `);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
