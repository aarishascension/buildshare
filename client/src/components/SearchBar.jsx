import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      technology: selectedTech,
      location: selectedLocation,
      lookingFor
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedTech('');
    setSelectedLocation('');
    setLookingFor('');
    onSearch({});
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="🔍 Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="search-filters">
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="filter-select"
          >
            <option value="">All Technologies</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
            <option value="TypeScript">TypeScript</option>
            <option value="MongoDB">MongoDB</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="Vue">Vue</option>
            <option value="Angular">Angular</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="San Francisco">San Francisco</option>
            <option value="New York">New York</option>
            <option value="Austin">Austin</option>
            <option value="Seattle">Seattle</option>
            <option value="Boston">Boston</option>
          </select>

          <select
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            className="filter-select"
          >
            <option value="">Looking For...</option>
            <option value="full-time">Full-Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="feedback">Feedback</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
