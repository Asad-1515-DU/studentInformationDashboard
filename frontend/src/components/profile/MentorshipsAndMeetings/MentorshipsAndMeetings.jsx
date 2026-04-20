import React, { useState } from 'react';

/**
 * MentorshipsAndMeetings Component
 * 
 * Displays mentorship relationships and upcoming meetings
 */

const MentorshipsAndMeetings = ({
  mentors = [],
  meetings = [],
  isLoadingMentors = false,
  isLoadingMeetings = false,
}) => {
  const [activeTab, setActiveTab] = useState('mentors');

  /**
   * Get meeting status color
   */
  const getMeetingStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return '#2196F3';
      case 'COMPLETED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#999';
    }
  };

  /**
   * Check if date is valid (in the future)
   */
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    try {
      const meetingDate = new Date(dateString);
      if (isNaN(meetingDate.getTime())) return false; // Invalid date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return meetingDate >= today;
    } catch (e) {
      return false;
    }
  };

  /**
   * Format date with error handling
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const isLoading = isLoadingMentors || isLoadingMeetings;

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Loading mentorship information...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        marginTop: 0,
        marginBottom: '20px'
      }}>👨‍🏫 Mentorship & Meetings</h2>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <button
          onClick={() => setActiveTab('mentors')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: activeTab === 'mentors' ? '#667eea' : 'transparent',
            color: activeTab === 'mentors' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            borderBottom: activeTab === 'mentors' ? '3px solid #667eea' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Mentors ({mentors.length})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: activeTab === 'meetings' ? '#667eea' : 'transparent',
            color: activeTab === 'meetings' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            borderBottom: activeTab === 'meetings' ? '3px solid #667eea' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Meetings ({meetings.length})
        </button>
      </div>

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div>
          {mentors.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              color: '#999'
            }}>
              <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>👤</p>
              <p>No mentors assigned yet</p>
            </div>
          ) : (
            mentors.map((mentor) => (
              <div
                key={mentor.id}
                style={{
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              >
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>{mentor.name}</h3>
                <p style={{
                  margin: '5px 0',
                  fontSize: '13px',
                  color: '#666'
                }}><strong>Department:</strong> {mentor.department || 'N/A'}</p>
                <p style={{
                  margin: '5px 0',
                  fontSize: '13px',
                  color: '#666'
                }}><strong>Expertise:</strong> {mentor.expertise || 'N/A'}</p>
                <p style={{
                  margin: '5px 0',
                  fontSize: '13px',
                  color: '#666'
                }}><strong>Email:</strong> {mentor.email || 'N/A'}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div>
          {meetings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              color: '#999'
            }}>
              <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>📅</p>
              <p>No meetings scheduled</p>
            </div>
          ) : (
            meetings.map((meeting) => {
              const isValid = isValidDate(meeting.date);
              return (
              <div
                key={meeting.id}
                style={{
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  borderLeft: `4px solid ${getMeetingStatusColor(meeting.status)}`,
                  border: isValid ? '2px solid #4CAF50' : 'none',
                  boxShadow: isValid ? '0 0 8px rgba(76, 175, 80, 0.3)' : 'none',
                  position: 'relative'
                }}
              >
                {isValid && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    ✓ Valid
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div>
                    <p style={{
                      margin: '0 0 5px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>📅 {formatDate(meeting.date)}</p>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: getMeetingStatusColor(meeting.status),
                    whiteSpace: 'nowrap'
                  }}>
                    {meeting.status}
                  </span>
                </div>
                {meeting.duration && (
                  <p style={{
                    margin: '5px 0',
                    fontSize: '13px',
                    color: '#666'
                  }}><strong>Duration:</strong> {meeting.duration} minutes</p>
                )}
                {meeting.notes && (
                  <p style={{
                    margin: '5px 0',
                    fontSize: '13px',
                    color: '#666'
                  }}><strong>Notes:</strong> {meeting.notes}</p>
                )}
              </div>
            );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MentorshipsAndMeetings;