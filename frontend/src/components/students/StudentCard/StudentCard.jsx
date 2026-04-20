import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentCard.css';

/**
 * StudentCard Component
 * 
 * Displays a student card with:
 * - Photo/Icon
 * - Name
 * - Academic Year
 * - Major
 * - Enrollment Status
 * - GPA
 * - Credits Completed
 */

const StudentCard = ({ student }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!student) {
    return null;
  }

  /**
   * Calculate academic year from enrollment date
   */
  const getAcademicYear = () => {
    if (!student.enrollmentDate) return 'Year 1';
    const enrollmentYear = new Date(student.enrollmentDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const year = Math.max(1, currentYear - enrollmentYear + 1);
    return `Year ${year}`;
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'GRADUATED':
        return 'status-graduated';
      default:
        return 'status-active';
    }
  };

  /**
   * Format GPA to 2 decimal places
   */
  const formatGPA = (gpa) => {
    if (gpa === null || gpa === undefined) return '—';
    return parseFloat(gpa).toFixed(2);
  };

  /**
   * Get student initials for avatar
   */
  const getInitials = (name) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Navigate to student profile
   */
  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentPath = location.pathname + location.search;
    console.log('🎯 StudentCard clicked');
    console.log('   Student ID:', student.id);
    console.log('   Student Name:', student.name);
    console.log('   Current Path:', currentPath);
    
    try {
      navigate(`/students/${student.id}`, {
        state: { from: currentPath },
        replace: false
      });
      console.log('✅ Navigation triggered to:', `/students/${student.id}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  const academicYear = getAcademicYear();
  const statusClass = getStatusColor(student.status);
  const gpaDisplay = formatGPA(student.gpa);
  const initials = getInitials(student.name);

  return (
    <div 
      className="student-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e);
        }
      }}
    >
      {/* Card Header with Photo and Status */}
      <div className="student-card__header">
        {/* Photo/Avatar */}
        <div className="student-card__avatar">
          {student.photo ? (
            <img 
              src={student.photo} 
              alt={student.name}
              className="student-card__photo"
            />
          ) : (
            <div className="student-card__initials">
              {initials}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <span className={`student-card__status ${statusClass}`}>
          {student.status || 'ACTIVE'}
        </span>
      </div>

      {/* Card Body - Student Information */}
      <div className="student-card__body">
        {/* Name */}
        <h3 className="student-card__name">{student.name}</h3>

        {/* Info Grid */}
        <div className="student-card__info">
          {/* Academic Year */}
          <div className="student-card__info-item">
            <span className="student-card__info-label">📚 Year</span>
            <span className="student-card__info-value">{academicYear}</span>
          </div>

          {/* Major */}
          {student.major && (
            <div className="student-card__info-item">
              <span className="student-card__info-label">🎓 Major</span>
              <span className="student-card__info-value">{student.major}</span>
            </div>
          )}

          {/* GPA */}
          <div className="student-card__info-item">
            <span className="student-card__info-label">📊 GPA</span>
            <span className="student-card__info-value">{gpaDisplay}</span>
          </div>

          {/* Credits Completed */}
          {student.creditsCompleted !== undefined && (
            <div className="student-card__info-item">
              <span className="student-card__info-label">✓ Credits</span>
              <span className="student-card__info-value">{student.creditsCompleted}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer - CTA */}
      <div className="student-card__footer">
        <p className="student-card__cta">View Full Profile →</p>
      </div>
    </div>
  );
};

export default StudentCard;
