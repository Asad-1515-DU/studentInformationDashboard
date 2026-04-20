import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  useStudent,
  useStudentFullProfile,
  useStudentScholarships,
  useStudentMeetings,
  useStudentMentors,
  useStudentCourses,
} from '../../api/hooks/useStudents';
import ProfileHeader from '../../components/profile/ProfileHeader/ProfileHeader';
import AcademicProgress from '../../components/profile/AcademicProgress/AcademicProgress';
import ScholarshipsList from '../../components/profile/ScholarshipsList/ScholarshipsList';
import MentorshipsAndMeetings from '../../components/profile/MentorshipsAndMeetings/MentorshipsAndMeetings';

const StudentProfileDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const previousLocation = location.state?.from || '/students';

  // Fetch all required data
  const { data: student, isLoading: studentLoading, error: studentError } = useStudent(id);
  const { data: fullProfile } = useStudentFullProfile(id); // Get progressRecords
  const { data: scholarships = [] } = useStudentScholarships(id);
  const { data: meetings = [] } = useStudentMeetings(id);
  const { data: mentors = [] } = useStudentMentors(id);
  const { data: courses = [] } = useStudentCourses(id);

  // Combine loading and error states
  const isLoading = studentLoading;
  const error = studentError;

  // Debug logging
  React.useEffect(() => {
    console.log('📄 StudentProfileDashboard Loaded');
    console.log('  Student ID:', id);
    console.log('  Loading:', isLoading);
    console.log('  Student Data:', student);
    console.log('  Scholarships:', scholarships?.length);
    console.log('  Meetings:', meetings?.length);
    console.log('  Mentors:', mentors?.length);
  }, [id, isLoading, student, scholarships, meetings, mentors]);

  return (
    <div style={{ 
      backgroundColor: '#0F172A', 
      minHeight: '100vh', 
      padding: '20px',
      position: 'relative',
      zIndex: 1 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Back Button - Always visible */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => navigate(previousLocation)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#60A5FA'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3B82F6'}
          >
            ← Back to Directory
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            backgroundColor: '#1E293B',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
            <h2 style={{ color: '#E5E7EB', fontSize: '24px', fontWeight: '600' }}>Loading Student Profile...</h2>
            <p style={{ color: '#9CA3AF', marginTop: '10px' }}>Please wait while we fetch the student information</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '2px solid #ef4444', 
            borderRadius: '8px', 
            padding: '30px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#fca5a5', fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>⚠️ Error Loading Student Profile</h2>
            <p style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>
              {error?.message || 'Failed to load student data. Please try again.'}
            </p>
            <p style={{ color: '#666', fontSize: '13px' }}>Student ID: {id}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#c00',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Student Profile - Main Content */}
        {student && !isLoading && !error && (
          <>
            {/* Section 1: Profile Header */}
            <section style={{ marginBottom: '40px' }}>
              <ProfileHeader student={student} />
            </section>

            {/* Sections 2-4 in Grid Layout */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr', 
              gap: '30px', 
              marginBottom: '40px',
              '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr'
              }
            }}>
              {/* Left Column */}
              <div>
                {/* Section 2: Academic Progress */}
                <section style={{ marginBottom: '30px' }}>
                  <AcademicProgress 
                    student={student} 
                    progressRecords={fullProfile?.progressRecords || []}
                    courses={courses}
                  />
                </section>

                {/* Section 3: Awarded Scholarships */}
                <section style={{ marginBottom: '30px' }}>
                  <ScholarshipsList scholarships={scholarships} isLoading={false} />
                </section>
              </div>

              {/* Right Column */}
              <div>
                {/* Section 4: Mentorship Panel */}
                <section style={{ marginBottom: '30px' }}>
                  <MentorshipsAndMeetings
                    mentors={mentors}
                    meetings={meetings}
                    isLoadingMentors={false}
                    isLoadingMeetings={false}
                  />
                </section>
              </div>
            </div>

            {/* Quick Actions */}
            <section style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '24px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: '600' 
              }}>⚡ Quick Actions</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '12px' 
              }}>
                <button style={{ 
                  padding: '12px', 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}>📧 Message Mentor</button>
                <button style={{ 
                  padding: '12px', 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}>📅 Schedule Meeting</button>
                <button style={{ 
                  padding: '12px', 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}>📝 Transcript</button>
                <button style={{ 
                  padding: '12px', 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}>⚙️ Settings</button>
              </div>
            </section>
          </>
        )}

        {/* No Data State */}
        {!student && !isLoading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ color: '#333', fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Student Not Found</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>We couldn't find a student with ID: {id}</p>
            <button
              onClick={() => navigate('/students')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Go to Student Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileDashboard;
