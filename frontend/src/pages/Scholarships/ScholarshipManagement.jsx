import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScholarships } from '../../api/hooks/useScholarships';
import ScholarshipForm from '../../components/scholarships/ScholarshipForm/ScholarshipForm';
import ScholarshipList from '../../components/scholarships/ScholarshipList/ScholarshipList';
import ScholarshipStatusUpdate from '../../components/scholarships/ScholarshipStatusUpdate/ScholarshipStatusUpdate';
import './ScholarshipManagement.css';

/**
 * ScholarshipManagement Page
 * 
 * Main page for managing scholarships
 * Features: List, Add, Edit, Update Status, Show Deadlines
 * Page state is persisted via URL query parameters for navigation consistency
 * 
 * @component
 * @example
 * // Add to App.jsx routes:
 * <Route path="/scholarships" element={<ScholarshipManagement />} />
 */
const ScholarshipManagement = () => {
  // Get and set URL search parameters for persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or use defaults
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialUpcomingOnly = searchParams.get('upcomingOnly') === 'true';

  // State
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage] = useState(5); // Fetch 5 scholarships
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [selectedScholarshipForStatus, setSelectedScholarshipForStatus] = useState(null);
  const [filters, setFilters] = useState({
    search: initialSearch,
    status: initialStatus,
    upcomingOnly: initialUpcomingOnly,
  });

  // API Calls
  const scholarshipsQuery = useScholarships(currentPage, itemsPerPage, {
    ...filters,
    search: filters.search,
    status: filters.status,
  });

  const scholarships = scholarshipsQuery.data?.data || [];
  const isLoading = scholarshipsQuery.isLoading;
  const error = scholarshipsQuery.error?.message;
  const totalScholarships = scholarshipsQuery.data?.pagination?.total || 0;

  /**
   * Handle add scholarship
   */
  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setShowAddForm(true);
  };

  /**
   * Handle edit scholarship
   */
  const handleEditScholarship = (scholarship) => {
    setEditingScholarship(scholarship);
    setShowAddForm(true);
  };

  /**
   * Handle delete scholarship
   */
  const handleDeleteScholarship = (id) => {
    const scholarship = scholarships.find((s) => s.id === id);
    setSelectedScholarshipForStatus(scholarship);
  };

  /**
   * Handle status change
   */
  const handleStatusChange = (scholarship) => {
    setSelectedScholarshipForStatus(scholarship);
  };

  /**
   * Handle form success
   */
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingScholarship(null);
    scholarshipsQuery.refetch();
  };

  /**
   * Handle form cancel
   */
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingScholarship(null);
  };

  /**
   * Handle status update success
   */
  const handleStatusUpdateSuccess = () => {
    setSelectedScholarshipForStatus(null);
    scholarshipsQuery.refetch();
  };

  /**
   * Handle filter change
   * Updates both state and URL query parameters
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL with new filters
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    if (newFilters.search) newParams.set('search', newFilters.search);
    if (newFilters.status) newParams.set('status', newFilters.status);
    if (newFilters.upcomingOnly) newParams.set('upcomingOnly', 'true');
    
    setSearchParams(newParams, { replace: false });
  };

  /**
   * Handle page change
   * Updates both state and URL query parameters
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Update URL with new page
    const newParams = new URLSearchParams();
    newParams.set('page', String(newPage));
    if (filters.search) newParams.set('search', filters.search);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.upcomingOnly) newParams.set('upcomingOnly', 'true');
    
    setSearchParams(newParams, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="scholarship-management">
      {/* Page Header */}
      <div className="scholarship-management__header">
        <div className="scholarship-management__title-section">
          <h1 className="scholarship-management__title">Scholarship Management</h1>
          <p className="scholarship-management__subtitle">
            Manage and track scholarships, deadlines, and applications
          </p>
        </div>

        <button
          className="scholarship-management__btn-add"
          onClick={handleAddScholarship}
        >
          ➕ Add New Scholarship
        </button>
      </div>

      {/* Main Content */}
      <div className="scholarship-management__content">
        {/* Main Content */}
        <div className="scholarship-management__main">
          {showAddForm ? (
            <div className="scholarship-management__form-container">
              <ScholarshipForm
                scholarship={editingScholarship}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="scholarship-management__filters">
                <div className="filter-group">
                  <label htmlFor="search" className="filter-label">
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or provider..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange({ ...filters, search: e.target.value })
                    }
                    className="filter-input search-input"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="status-filter" className="filter-label">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange({ ...filters, status: e.target.value })
                    }
                    className="filter-input filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="PENDING">Pending</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>

                <div className="filter-group filter-checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.upcomingOnly}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          upcomingOnly: e.target.checked,
                        })
                      }
                      className="filter-checkbox"
                    />
                    <span>Upcoming Deadlines Only</span>
                  </label>
                </div>
              </div>

              {/* Scholarships List */}
              <ScholarshipList
                scholarships={scholarships}
                isLoading={isLoading}
                error={error}
                onEdit={handleEditScholarship}
                onDelete={handleDeleteScholarship}
                onStatusChange={handleStatusChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                total={totalScholarships}
                page={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <ScholarshipStatusUpdate
        scholarship={selectedScholarshipForStatus}
        isOpen={!!selectedScholarshipForStatus}
        onClose={() => setSelectedScholarshipForStatus(null)}
        onSuccess={handleStatusUpdateSuccess}
      />
    </div>
  );
};

export default ScholarshipManagement;
