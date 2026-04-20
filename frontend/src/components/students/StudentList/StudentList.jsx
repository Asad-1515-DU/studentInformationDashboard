import React from 'react';
import StudentCard from '../StudentCard/StudentCard';
import './StudentList.css';

/**
 * StudentList Component
 * 
 * Displays a grid of StudentCard components
 * Handles loading, empty, and error states
 */

const StudentList = ({ students, isLoading, error }) => {
  /**
   * Render skeleton placeholder cards during loading
   */
  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div key={`skeleton-${i}`} className="student-list__skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    ));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="student-list">
        <div className="student-list__loading">
          {renderSkeleton()}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="student-list__error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Load Students</h3>
        <p>{error.message || 'Something went wrong. Please try again.'}</p>
      </div>
    );
  }

  // Empty state
  if (!students || students.length === 0) {
    return (
      <div className="student-list__empty">
        <div className="empty-icon">🔍</div>
        <h3>No Students Found</h3>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  // Students list
  return (
    <div className="student-list">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
};

export default StudentList;
