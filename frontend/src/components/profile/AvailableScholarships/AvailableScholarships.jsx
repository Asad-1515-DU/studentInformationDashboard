import React, { useState } from 'react';
import { useUpcomingDeadlines } from '../../../api/hooks/useScholarships';

/**
 * AvailableScholarships Component
 * 
 * Displays scholarships available for students to apply
 * Shows first 5 scholarships with upcoming deadlines
 */

const AvailableScholarships = () => {
  const [expandedId, setExpandedId] = useState(null);

  // Fetch scholarships with upcoming deadlines (within 90 days)
  const { data: upcomingScholarships = [], isLoading, error } = useUpcomingDeadlines(90);

  /**
   * Toggle expanded scholarship details
   */
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Get days until deadline
   */
  const getDaysUntilDeadline = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Get deadline color
   */
  const getDeadlineColor = (dateString) => {
    const days = getDaysUntilDeadline(dateString);
    if (!days) return '#999';
    if (days <= 0) return '#F44336'; // Expired
    if (days <= 7) return '#FF9800'; // Urgent
    if (days <= 14) return '#FFC107'; // Soon
    return '#4CAF50'; // Plenty of time
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Loading available scholarships...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#F44336', fontWeight: '600' }}>⚠️ Error loading scholarships</p>
        <small style={{ color: '#999' }}>Please try again later</small>
      </div>
    );
  }

  // Get first 5 scholarships
  const scholarships = upcomingScholarships.slice(0, 5);

  // Handle empty state
  if (!scholarships || scholarships.length === 0) {
    return (
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          marginTop: 0,
          marginBottom: '10px'
        }}>💼 Available Scholarships</h2>
        <div style={{ color: '#999' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
          <p style={{ margin: '10px 0' }}>No scholarships currently available</p>
          <small style={{ color: '#bbb' }}>Check back later for new opportunities</small>
        </div>
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
      }}>💼 Available Scholarships ({scholarships.length})</h2>

      {/* Scholarships List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scholarships.map((scholarship) => {
          const daysLeft = getDaysUntilDeadline(scholarship.endDate);
          const isExpanded = expandedId === scholarship.id;

          return (
            <div
              key={scholarship.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpanded(scholarship.id)}
                style={{
                  padding: '16px',
                  backgroundColor: isExpanded ? '#f0f3ff' : '#fafafa',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isExpanded ? '#f0f3ff' : '#f5f5f5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isExpanded ? '#f0f3ff' : '#fafafa';
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#333'
                  }}>{scholarship.name}</h3>
                  
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <span style={{ fontWeight: '600' }}>
                      💰 {formatCurrency(scholarship.amount)}
                    </span>
                    <span style={{
                      color: getDeadlineColor(scholarship.endDate),
                      fontWeight: '600'
                    }}>
                      📅 {formatDate(scholarship.endDate)}
                      {daysLeft && daysLeft > 0 && ` (${daysLeft} days left)`}
                      {daysLeft && daysLeft <= 0 && ' (Expired)'}
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: '20px',
                  marginLeft: '12px',
                  transition: 'transform 0.3s ease',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div style={{
                  padding: '16px',
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#f9fafb'
                }}>
                  {scholarship.description && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{
                        margin: '0 0 6px 0',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase'
                      }}>Description</p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#555',
                        lineHeight: '1.5'
                      }}>{scholarship.description}</p>
                    </div>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                  }}>
                    <div>
                      <p style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase'
                      }}>Start Date</p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#333',
                        fontWeight: '500'
                      }}>{formatDate(scholarship.startDate)}</p>
                    </div>

                    <div>
                      <p style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase'
                      }}>End Date</p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#333',
                        fontWeight: '500'
                      }}>{formatDate(scholarship.endDate)}</p>
                    </div>

                    <div>
                      <p style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase'
                      }}>Status</p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: scholarship.status === 'ACTIVE' ? '#4CAF50' : '#FF9800',
                        fontWeight: '500'
                      }}>{scholarship.status || 'ACTIVE'}</p>
                    </div>

                    <div>
                      <p style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase'
                      }}>Amount</p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#333',
                        fontWeight: '700'
                      }}>{formatCurrency(scholarship.amount)}</p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '10px 16px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'background-color 0.3s'
                  }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
                  >
                    Apply for Scholarship
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableScholarships;
