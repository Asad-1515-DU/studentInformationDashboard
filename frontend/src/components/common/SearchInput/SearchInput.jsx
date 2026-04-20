import React from 'react';
import './SearchInput.css';

/**
 * SearchInput Component
 * 
 * Search bar with clear button
 * Handles text input and filtering
 */

const SearchInput = ({ value, onChange, onClear, disabled = false }) => {
  return (
    <div className="search-input">
      <input
        type="text"
        className="search-input__field"
        placeholder="Search students by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Search students"
      />

      {value && (
        <button
          className="search-input__clear"
          onClick={onClear}
          disabled={disabled}
          title="Clear search"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
