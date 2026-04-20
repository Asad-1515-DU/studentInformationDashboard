import React, { useState } from 'react';
import { useMeetings, useUpcomingMeetings, useCreateMeeting, useDeleteMeeting, useUpdateMeetingStatus } from '../../api/hooks/useMeetings';
import { useStudents } from '../../api/hooks/useStudents';
import { useMentors } from '../../api/hooks/useMentors';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import Pagination from '../../components/common/Pagination/Pagination';
import './MeetingsPage.css';

/**
 * Meetings Page
 * 
 * Main page component that displays:
 * - Upcoming meetings
 * - All meetings with search and filters
 * - Meeting management functionality
 * - Schedule new meetings
 */

const ITEMS_PER_PAGE = 10;

const MeetingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    mentorId: '',
    studentId: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
    status: 'SCHEDULED',
  });

  // API Calls
  const meetingsQuery = useMeetings(currentPage, ITEMS_PER_PAGE, {
    search: searchTerm,
    status: statusFilter,
  });

  const upcomingQuery = useUpcomingMeetings();
  const createMeetingMutation = useCreateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();
  const updateStatusMutation = useUpdateMeetingStatus();

  // Fetch students and mentors for form selections
  const studentsQuery = useStudents(1, 200);
  const mentorsQuery = useMentors(1, 200);

  const meetings = meetingsQuery.data?.data || [];
  const upcomingMeetings = upcomingQuery.data || [];
  const students = studentsQuery.data?.data || [];
  const mentors = mentorsQuery.data?.data || [];
  const isLoading = meetingsQuery.isLoading;
  const error = meetingsQuery.error?.message;
  const totalPages = meetingsQuery.data?.pagination?.pages || 1;

  /**
   * Handle add/edit form submission
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.mentorId || !formData.studentId || !formData.date || !formData.time) {
      alert('Please fill in all required fields (Mentor, Student, Date, Time)');
      return;
    }

    // Combine date and time into single ISO datetime
    const dateTimeString = `${formData.date}T${formData.time}:00`;
    const dateTime = new Date(dateTimeString);
    
    if (isNaN(dateTime.getTime())) {
      alert('Invalid date or time format');
      return;
    }

    // Validate duration
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 15 || duration > 480) {
      alert('Duration must be between 15 and 480 minutes');
      return;
    }

    // Transform data to match backend schema
    const submitData = {
      mentorId: formData.mentorId.trim(),
      studentId: formData.studentId.trim(),
      date: dateTime.toISOString(),
      duration: duration,
      notes: formData.notes.trim() || null,
      status: formData.status || 'SCHEDULED',
    };
    
    if (editingMeeting) {
      // Update existing meeting - only status can be updated
      updateStatusMutation.mutate(
        { id: editingMeeting.id, status: formData.status },
        {
          onSuccess: () => {
            resetForm();
            setShowAddForm(false);
          },
          onError: (error) => {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update meeting';
            alert(`Error: ${errorMsg}`);
            console.error('Update error:', error);
          },
        }
      );
    } else {
      // Create new meeting
      createMeetingMutation.mutate(submitData, {
        onSuccess: () => {
          resetForm();
          setShowAddForm(false);
        },
        onError: (error) => {
          const errorMsg = error.response?.data?.message || error.message || 'Failed to create meeting';
          alert(`Error: ${errorMsg}`);
          console.error('Create error:', error);
        },
      });
    }
  };

  /**
   * Handle delete meeting
   */
  const handleDeleteMeeting = (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      deleteMeetingMutation.mutate(id);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      mentorId: '',
      studentId: '',
      date: '',
      time: '',
      duration: '60',
      notes: '',
      status: 'SCHEDULED',
    });
    setEditingMeeting(null);
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle search
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  /**
   * Handle retry on error
   */
  const handleRetry = () => {
    meetingsQuery.refetch();
    upcomingQuery.refetch();
  };

  return (
    <div className="meetings-page">
      <div className="meetings-page__container">
        {/* Header */}
        <div className="meetings-page__header">
          <div className="meetings-page__header-content">
            <h1 className="meetings-page__title">Meetings & Schedule</h1>
            <p className="meetings-page__subtitle">
              Manage mentorship meetings and schedule new sessions
            </p>
          </div>
          <button 
            className="meetings-page__btn-add"
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          >
            + Schedule Meeting
          </button>
        </div>

        {/* Upcoming Meetings Section */}
        {upcomingMeetings.length > 0 && (
          <section className="meetings-page__upcoming">
            <h2 className="meetings-page__section-title">Upcoming Meetings (Next 7 Days)</h2>
            <div className="meetings-page__upcoming-grid">
              {upcomingMeetings.slice(0, 3).map((meeting) => (
                <div key={meeting.id} className="meetings-page__upcoming-card">
                  <div className="meetings-page__upcoming-time">
                    {new Date(meeting.scheduledDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="meetings-page__upcoming-title">{meeting.title}</h3>
                  <p className="meetings-page__upcoming-detail">
                    <strong>Time:</strong> {meeting.scheduledTime}
                  </p>
                  <p className="meetings-page__upcoming-detail">
                    <strong>Location:</strong> {meeting.location}
                  </p>
                  <span className={`meetings-page__status meetings-page__status--${meeting.status}`}>
                    {meeting.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="meetings-page__controls">
          <div className="meetings-page__search-wrapper">
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search meetings by title or location..."
            />
          </div>

          <div className="meetings-page__filter">
            <label htmlFor="status-filter" className="meetings-page__filter-label">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="meetings-page__filter-select"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </section>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="meetings-page__form-overlay">
            <div className="meetings-page__form-container">
              <div className="meetings-page__form-header">
                <h2>{editingMeeting ? 'Update Meeting' : 'Schedule New Meeting'}</h2>
                <button
                  className="meetings-page__form-close"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(false);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="meetings-page__form">
                <div className="meetings-page__form-row">
                  <div className="meetings-page__form-group">
                    <label htmlFor="studentId">Student *</label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      disabled={editingMeeting || studentsQuery.isLoading}
                      className="meetings-page__form-select"
                    >
                      <option value="">Select a student...</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="meetings-page__form-group">
                    <label htmlFor="mentorId">Mentor *</label>
                    <select
                      id="mentorId"
                      name="mentorId"
                      value={formData.mentorId}
                      onChange={handleInputChange}
                      required
                      disabled={editingMeeting || mentorsQuery.isLoading}
                      className="meetings-page__form-select"
                    >
                      <option value="">Select a mentor...</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                          {mentor.name} ({mentor.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="meetings-page__form-row">
                  <div className="meetings-page__form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      disabled={editingMeeting}
                    />
                  </div>

                  <div className="meetings-page__form-group">
                    <label htmlFor="time">Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      disabled={editingMeeting}
                    />
                  </div>
                </div>

                <div className="meetings-page__form-group">
                  <label htmlFor="duration">Duration (minutes) *</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="480"
                    placeholder="60"
                    required
                    disabled={editingMeeting}
                  />
                </div>

                <div className="meetings-page__form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add meeting details or agenda..."
                    rows="4"
                    disabled={editingMeeting}
                  />
                </div>

                {editingMeeting && (
                  <div className="meetings-page__form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="RESCHEDULED">Rescheduled</option>
                    </select>
                  </div>
                )}

                <div className="meetings-page__form-actions">
                  <button
                    type="button"
                    className="meetings-page__btn-cancel"
                    onClick={() => {
                      resetForm();
                      setShowAddForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="meetings-page__btn-submit"
                    disabled={createMeetingMutation.isPending || updateStatusMutation.isPending}
                  >
                    {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="meetings-page__error">
            <p className="meetings-page__error-text">Failed to load meetings</p>
            <button
              className="meetings-page__btn-retry"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="meetings-page__loading">
            <div className="meetings-page__spinner"></div>
            <p>Loading meetings...</p>
          </div>
        )}

        {/* Meetings Grid */}
        {!isLoading && meetings.length > 0 && (
          <section className="meetings-page__list">
            <h2 className="meetings-page__section-title">All Meetings</h2>
            <div className="meetings-page__table-wrapper">
              <table className="meetings-page__table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => {
                    const meetingDate = meeting.date ? new Date(meeting.date) : null;
                    const formattedDate = meetingDate && !isNaN(meetingDate.getTime()) 
                      ? meetingDate.toLocaleDateString() 
                      : 'Invalid date';
                    const formattedTime = meeting.duration 
                      ? `${Math.floor(meeting.duration / 60)}h ${meeting.duration % 60}m`
                      : 'N/A';
                    
                    return (
                    <tr key={meeting.id} className="meetings-page__table-row">
                      <td className="meetings-page__cell-title">{meeting.student?.name || 'N/A'}</td>
                      <td>{formattedDate}</td>
                      <td>{formattedTime}</td>
                      <td>{meeting.mentor?.name || 'N/A'}</td>
                      <td>
                        <span className={`meetings-page__status meetings-page__status--${meeting.status.toLowerCase()}`}>
                          {meeting.status}
                        </span>
                      </td>
                      <td className="meetings-page__cell-actions">
                        <button
                          className="meetings-page__btn-edit"
                          onClick={() => {
                            setEditingMeeting(meeting);
                            const dateObj = new Date(meeting.date);
                            setFormData({
                              title: meeting.student?.name || '',
                              mentorId: meeting.mentorId,
                              studentId: meeting.studentId,
                              scheduledDate: dateObj.toISOString().split('T')[0],
                              scheduledTime: '09:00',
                              location: 'Office',
                              description: meeting.notes || '',
                              status: meeting.status,
                            });
                            setShowAddForm(true);
                          }}
                          title="Edit meeting"
                        >
                          ✎
                        </button>
                        <button
                          className="meetings-page__btn-delete"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          title="Delete meeting"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        )}

        {/* Empty State */}
        {!isLoading && meetings.length === 0 && !error && (
          <div className="meetings-page__empty">
            <div className="meetings-page__empty-icon">📅</div>
            <h3 className="meetings-page__empty-title">No Meetings Found</h3>
            <p className="meetings-page__empty-text">
              {searchTerm || statusFilter
                ? 'Try adjusting your filters or search terms.'
                : 'Schedule your first meeting to get started!'}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                className="meetings-page__btn-add-empty"
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
              >
                + Schedule First Meeting
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
