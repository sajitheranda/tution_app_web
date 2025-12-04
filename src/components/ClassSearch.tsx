"use client";
import { useState, useMemo, useEffect } from 'react';
import { searchClasses, subjects, grades, locations, dummyClasses } from '@/data/dummyData';
import { ClassType } from '@/types/class';
import ClassCard from './ClassCard';
import ClassDetailsModal from './ClassDetailsModal';

export default function ClassSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    location: '',
    type: ''
  });
  const [searchResults, setSearchResults] = useState<ClassType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showFilterDropdowns, setShowFilterDropdowns] = useState({
    subject: false,
    grade: false,
    location: false
  });
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);

  // Generate search suggestions based on available data
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show popular searches when empty
      return [
        'Mathematics',
        'Science',
        'English',
        'Grade 10',
        'Colombo',
        'Online Classes'
      ];
    }

    const suggestions = new Set<string>();
    
    // Add subjects
    subjects.forEach(subject => {
      if (subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(subject);
      }
    });
    
    // Add grades
    grades.forEach(grade => {
      if (grade.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(grade);
      }
    });
    
    // Add teacher names
    dummyClasses.forEach(classItem => {
      if (classItem.teacherName.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(classItem.teacherName);
      }
    });
    
    // Add locations
    locations.forEach(location => {
      if (location.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(location);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [searchQuery]);

  // Filter suggestions for dropdowns - show all when empty
  const subjectSuggestions = useMemo(() => {
    if (!filters.subject.trim()) {
      return subjects;
    }
    return subjects.filter(subject => 
      subject.toLowerCase().includes(filters.subject.toLowerCase())
    );
  }, [filters.subject]);

  const gradeSuggestions = useMemo(() => {
    if (!filters.grade.trim()) {
      return grades;
    }
    return grades.filter(grade => 
      grade.toLowerCase().includes(filters.grade.toLowerCase())
    );
  }, [filters.grade]);

  const locationSuggestions = useMemo(() => {
    if (!filters.location.trim()) {
      return locations;
    }
    return locations.filter(location => 
      location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }, [filters.location]);

  // Auto-search when filters change or after typing stops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const results = searchClasses(searchQuery, filters);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleSearch = () => {
    const results = searchClasses(searchQuery, filters);
    setSearchResults(results);
    setShowSuggestions(false);
    setShowFilterDropdowns({ subject: false, grade: false, location: false });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleFilterSuggestionClick = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setShowFilterDropdowns(prev => ({ ...prev, [filterType]: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && searchSuggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(searchSuggestions[activeSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ subject: '', grade: '', location: '', type: '' });
    setSearchResults([]);
    setShowSuggestions(false);
    setShowFilterDropdowns({ subject: false, grade: false, location: false });
  };

  const clearFilter = (filterType: string) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search classes by subject, grade, teacher name, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchQuery.trim() === '' && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    Popular searches:
                  </div>
                )}
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      index === activeSuggestionIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    } ${index === 0 && searchQuery.trim() !== '' ? 'rounded-t-lg' : ''} ${
                      index === searchSuggestions.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🔍</span>
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Clear All
          </button>
        </div>

        {/* Enhanced Filters with Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subject Filter with Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="select subject..."
                value={filters.subject}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, subject: e.target.value }));
                  setShowFilterDropdowns(prev => ({ ...prev, subject: true }));
                }}
                onFocus={() => setShowFilterDropdowns(prev => ({ ...prev, subject: true }))}
                onBlur={() => setTimeout(() => setShowFilterDropdowns(prev => ({ ...prev, subject: false })), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showFilterDropdowns.subject && subjectSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {filters.subject ? 'Matching subjects' : 'All subjects'}
                  </div>
                  {subjectSuggestions.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleFilterSuggestionClick('subject', subject)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grade Filter with Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="select grade..."
                value={filters.grade}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, grade: e.target.value }));
                  setShowFilterDropdowns(prev => ({ ...prev, grade: true }));
                }}
                onFocus={() => setShowFilterDropdowns(prev => ({ ...prev, grade: true }))}
                onBlur={() => setTimeout(() => setShowFilterDropdowns(prev => ({ ...prev, grade: false })), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showFilterDropdowns.grade && gradeSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {filters.grade ? 'Matching grades' : 'All grades'}
                  </div>
                  {gradeSuggestions.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleFilterSuggestionClick('grade', grade)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location Filter with Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="select location..."
                value={filters.location}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, location: e.target.value }));
                  setShowFilterDropdowns(prev => ({ ...prev, location: true }));
                }}
                onFocus={() => setShowFilterDropdowns(prev => ({ ...prev, location: true }))}
                onBlur={() => setTimeout(() => setShowFilterDropdowns(prev => ({ ...prev, location: false })), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showFilterDropdowns.location && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {filters.location ? 'Matching locations' : 'All locations'}
                  </div>
                  {locationSuggestions.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleFilterSuggestionClick('location', location)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Class Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="individual">👤 Individual</option>
              <option value="group">👥 Group</option>
              <option value="mass">🏫 Mass</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || Object.values(filters).some(filter => filter !== '')) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.subject && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Subject: {filters.subject}
                <button
                  onClick={() => clearFilter('subject')}
                  className="ml-1 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.grade && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Grade: {filters.grade}
                <button
                  onClick={() => clearFilter('grade')}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Location: {filters.location}
                <button
                  onClick={() => clearFilter('location')}
                  className="ml-1 hover:text-orange-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Type: {filters.type}
                <button
                  onClick={() => clearFilter('type')}
                  className="ml-1 hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchResults.length} {searchResults.length === 1 ? 'Class' : 'Classes'} Found
          </h2>
          {searchResults.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing all matching classes
            </div>
          )}
        </div>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(classItem => (
              <ClassCard 
                key={classItem.id} 
                classItem={classItem} 
                onViewDetails={setSelectedClass}
              />
            ))}
          </div>
        )}
      </div>
      {selectedClass && (
        <ClassDetailsModal
          classItem={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
      
    </div>
  );
}