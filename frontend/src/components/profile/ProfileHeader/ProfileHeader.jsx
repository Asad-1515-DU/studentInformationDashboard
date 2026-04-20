import React from 'react';
import './ProfileHeader.css';

/**
 * ProfileHeader Component
 * 
 * Displays student's basic information:
 * - Name, email, major, GPA, status
 * - Profile picture placeholder
 * - Contact information
 */

const ProfileHeader = ({ student, isLoading = false }) => {
  if (isLoading || !student) {
    return (
      <div style={{ 
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Loading profile information...</p>
      </div>
    );
  }

  // Always render with available data
  return (
    <div style={{
      background: 'linear-gradient(135deg, #87CEEB 0%, #4A90A4 100%)',
      color: '#000000',
      padding: '2rem',
      marginBottom: '2rem',
      borderRadius: '8px',
      border: '2px solid #87CEEB',
      boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Avatar */}
        <div style={{
          flexShrink: 0
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#4A90A4'
          }}>
            {student.name
              ?.split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'S'}
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 0.25rem',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#000000'
              }}>{student.name}</h1>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                color: '#333333',
                fontWeight: 500
              }}>{student.major || 'Major not specified'}</p>
            </div>
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: student.status === 'ACTIVE' ? '#c8e6c9' : '#e0e0e0',
              border: student.status === 'ACTIVE' ? '2px solid #4caf50' : '2px solid #9e9e9e',
              color: student.status === 'ACTIVE' ? '#1b5e20' : '#424242'
            }}>
              {student.status || 'ACTIVE'}
            </span>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <span style={{
                fontSize: '0.85rem',
                color: '#333333',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>GPA</span>
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white'
              }}>{student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <span style={{
                fontSize: '0.85rem',
                color: '#333333',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Email</span>
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                wordBreak: 'break-word'
              }}>{student.email}</span>
            </div>
            {student.phone && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  color: '#333333',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Phone</span>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white'
                }}>{student.phone}</span>
              </div>
            )}
            {student.address && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  color: '#333333',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Address</span>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  wordBreak: 'break-word'
                }}>{student.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
