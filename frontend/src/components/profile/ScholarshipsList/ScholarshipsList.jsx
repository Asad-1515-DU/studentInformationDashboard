import React, { useState } from 'react';

/**
 * ScholarshipsList Component
 * 
 * Displays list of scholarships with details
 */

const ScholarshipsList = ({ scholarships = [], isLoading = false }) => {
  const [expandedId, setExpandedId] = useState(null);

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
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return '#4CAF50';
      case 'PENDING':
        return '#FF9800';
      case 'EXPIRED':
        return '#F44336';
      default:
        return '#999';
    }
  };

  /**
   * Render loading state
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
        <p>Loading scholarships...</p>
      </div>
    );
  }

  /**
   * Render empty state
   */
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
        }}>🎓 Scholarships</h2>
        <div style={{ color: '#999' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎓</div>
          <p style={{ margin: '10px 0' }}>No scholarships currently awarded</p>
          <small style={{ color: '#bbb' }}>Check back later for scholarship opportunities</small>
        </div>
      </div>
    );
  }

  /**
   * Calculate total scholarship amount
   */
  const totalAmount = scholarships.reduce((sum, s) => sum + (s.awardedAmount || 0), 0);

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
      }}>🎓 Scholarship Tracker</h2>

      {/* Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px'
      }}>
        <div>
          <p style={{
            margin: '0 0 5px 0',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase'
          }}>Total Awarded</p>
          <p style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>{formatCurrency(totalAmount)}</p>
        </div>
        <div>
          <p style={{
            margin: '0 0 5px 0',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase'
          }}>Active Scholarships</p>
          <p style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>{scholarships.length}</p>
        </div>
      </div>

      {/* Scholarships List */}
      <div>
        {scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            style={{
              borderTop: '1px solid #e0e0e0',
              paddingTop: '12px',
              paddingBottom: '12px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div
              onClick={() => toggleExpanded(scholarship.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>{scholarship.scholarship?.name || 'Scholarship'}</h3>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#666'
                }}>
                  Amount: {formatCurrency(scholarship.awardedAmount)}
                </p>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: getStatusColor(scholarship.status),
                whiteSpace: 'nowrap'
              }}>
                {scholarship.status}
              </span>
            </div>

            {/* Expanded Details */}
            {expandedId === scholarship.id && (
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e0e0e0',
                fontSize: '14px',
                color: '#555'
              }}>
                <p><strong>Award Date:</strong> {new Date(scholarship.awardedDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {scholarship.scholarship?.description || 'N/A'}</p>
                {scholarship.scholarship?.endDate && (
                  <p><strong>Deadline:</strong> {new Date(scholarship.scholarship.endDate).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsList;