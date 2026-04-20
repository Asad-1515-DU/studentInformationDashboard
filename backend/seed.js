import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.studentScholarship.deleteMany({});
    await prisma.scholarship.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.mentor.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create mentors
    const mentors = await Promise.all([
      prisma.mentor.create({
        data: {
          name: 'Dr. John Smith',
          email: 'john.smith@university.edu',
          expertise: 'Computer Science',
          department: 'Engineering',
        },
      }),
      prisma.mentor.create({
        data: {
          name: 'Prof. Sarah Johnson',
          email: 'sarah.johnson@university.edu',
          expertise: 'Mathematics',
          department: 'Science',
        },
      }),
      prisma.mentor.create({
        data: {
          name: 'Dr. Michael Brown',
          email: 'michael.brown@university.edu',
          expertise: 'Business',
          department: 'Business School',
        },
      }),
    ]);
    console.log(`✓ Created ${mentors.length} mentors`);

    // Create scholarships
    const scholarships = await Promise.all([
      prisma.scholarship.create({
        data: {
          name: 'STEM Excellence Scholarship',
          description: 'For outstanding science and technology students',
          amount: 5000,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'ACTIVE',
        },
      }),
      prisma.scholarship.create({
        data: {
          name: 'Merit Scholarship',
          description: 'For high achieving students',
          amount: 3000,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'ACTIVE',
        },
      }),
      prisma.scholarship.create({
        data: {
          name: 'Need-Based Aid',
          description: 'For financially disadvantaged students',
          amount: 4000,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'ACTIVE',
        },
      }),
    ]);
    console.log(`✓ Created ${scholarships.length} scholarships`);

    // Create students
    const students = await Promise.all([
      prisma.student.create({
        data: {
          email: 'alice.johnson@student.edu',
          name: 'Alice Johnson',
          dateOfBirth: new Date('2003-05-15'),
          phone: '+1-555-0101',
          address: '123 Main St, City, State 12345',
          major: 'Computer Science',
          gpa: 3.8,
          status: 'ACTIVE',
          mentorId: mentors[0].id,
        },
      }),
      prisma.student.create({
        data: {
          email: 'bob.williams@student.edu',
          name: 'Bob Williams',
          dateOfBirth: new Date('2002-08-22'),
          phone: '+1-555-0102',
          address: '456 Oak Ave, City, State 12345',
          major: 'Mechanical Engineering',
          gpa: 3.6,
          status: 'ACTIVE',
          mentorId: mentors[1].id,
        },
      }),
      prisma.student.create({
        data: {
          email: 'carol.davis@student.edu',
          name: 'Carol Davis',
          dateOfBirth: new Date('2003-03-10'),
          phone: '+1-555-0103',
          address: '789 Pine Rd, City, State 12345',
          major: 'Business Administration',
          gpa: 3.9,
          status: 'ACTIVE',
          mentorId: mentors[2].id,
        },
      }),
      prisma.student.create({
        data: {
          email: 'david.miller@student.edu',
          name: 'David Miller',
          dateOfBirth: new Date('2002-11-30'),
          phone: '+1-555-0104',
          address: '321 Elm St, City, State 12345',
          major: 'Mathematics',
          gpa: 3.5,
          status: 'ACTIVE',
          mentorId: mentors[0].id,
        },
      }),
      prisma.student.create({
        data: {
          email: 'emma.wilson@student.edu',
          name: 'Emma Wilson',
          dateOfBirth: new Date('2003-07-18'),
          phone: '+1-555-0105',
          address: '654 Maple Dr, City, State 12345',
          major: 'Biology',
          gpa: 3.7,
          status: 'ACTIVE',
          mentorId: mentors[1].id,
        },
      }),
    ]);
    console.log(`✓ Created ${students.length} students`);

    // Assign scholarships to students
    const studentScholarships = await Promise.all([
      prisma.studentScholarship.create({
        data: {
          studentId: students[0].id,
          scholarshipId: scholarships[0].id,
          awardedAmount: 5000,
          awardedDate: new Date('2024-01-01'),
          status: 'ACTIVE',
        },
      }),
      prisma.studentScholarship.create({
        data: {
          studentId: students[1].id,
          scholarshipId: scholarships[1].id,
          awardedAmount: 3000,
          awardedDate: new Date('2024-01-01'),
          status: 'ACTIVE',
        },
      }),
      prisma.studentScholarship.create({
        data: {
          studentId: students[2].id,
          scholarshipId: scholarships[2].id,
          awardedAmount: 4000,
          awardedDate: new Date('2024-01-01'),
          status: 'ACTIVE',
        },
      }),
    ]);
    console.log(`✓ Created ${studentScholarships.length} student-scholarship assignments`);

    // Create Progress records with credits earned
    const progressRecords = await Promise.all([
      prisma.progress.create({
        data: {
          studentId: students[0].id,
          gpa: 3.8,
          semester: 1,
          academicYear: 2024,
          status: 'EXCELLENT',
          creditsEarned: 30,
          attendanceRate: 95,
          remarks: 'Outstanding academic performance'
        }
      }),
      prisma.progress.create({
        data: {
          studentId: students[1].id,
          gpa: 3.6,
          semester: 1,
          academicYear: 2024,
          status: 'ON_TRACK',
          creditsEarned: 28,
          attendanceRate: 92,
          remarks: 'Good progress in studies'
        }
      }),
      prisma.progress.create({
        data: {
          studentId: students[2].id,
          gpa: 3.9,
          semester: 1,
          academicYear: 2024,
          status: 'EXCELLENT',
          creditsEarned: 32,
          attendanceRate: 98,
          remarks: 'Exceptional academic achievement'
        }
      }),
      prisma.progress.create({
        data: {
          studentId: students[3].id,
          gpa: 3.5,
          semester: 1,
          academicYear: 2024,
          status: 'ON_TRACK',
          creditsEarned: 27,
          attendanceRate: 88,
          remarks: 'Consistent academic performance'
        }
      }),
      prisma.progress.create({
        data: {
          studentId: students[4].id,
          gpa: 3.7,
          semester: 1,
          academicYear: 2024,
          status: 'ON_TRACK',
          creditsEarned: 29,
          attendanceRate: 93,
          remarks: 'Good academic standing'
        }
      }),
    ]);
    console.log(`✓ Created ${progressRecords.length} progress records`);

    // Create Meetings
    const meetings = await Promise.all([
      prisma.meeting.create({
        data: {
          studentId: students[0].id,
          mentorId: mentors[0].id,
          date: new Date('2024-02-15'),
          duration: 60,
          status: 'COMPLETED',
          notes: 'Discussed project ideas and academic goals'
        }
      }),
      prisma.meeting.create({
        data: {
          studentId: students[1].id,
          mentorId: mentors[1].id,
          date: new Date('2024-02-20'),
          duration: 45,
          status: 'COMPLETED',
          notes: 'Reviewed coursework and progress'
        }
      }),
      prisma.meeting.create({
        data: {
          studentId: students[2].id,
          mentorId: mentors[2].id,
          date: new Date('2024-02-10'),
          duration: 60,
          status: 'COMPLETED',
          notes: 'Career planning and internship opportunities'
        }
      }),
    ]);
    console.log(`✓ Created ${meetings.length} meetings`);

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
