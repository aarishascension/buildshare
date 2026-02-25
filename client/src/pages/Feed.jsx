import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectPost from '../components/ProjectPost';
import SearchBar from '../components/SearchBar';
import GoogleAd from '../components/GoogleAd';
import { useAuth } from '../context/AuthContext';
import './Feed.css';

function Feed() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasMore: false
  });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setProjects([]);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProjects(1);
  }, [filter, searchFilters]);

  const fetchProjects = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // If search filters are active, use search endpoint
      if (Object.keys(searchFilters).length > 0 && Object.values(searchFilters).some(v => v)) {
        const params = new URLSearchParams();
        if (searchFilters.searchTerm) params.append('q', searchFilters.searchTerm);
        if (searchFilters.technology) params.append('technology', searchFilters.technology);
        if (searchFilters.location) params.append('location', searchFilters.location);
        if (searchFilters.lookingFor) params.append('lookingFor', searchFilters.lookingFor);
        params.append('page', page);
        params.append('limit', pagination.limit);
        
        const { data } = await axios.get(`/api/projects/search?${params.toString()}`);
        
        if (page === 1) {
          setProjects(data.projects);
        } else {
          setProjects(prev => [...prev, ...data.projects]);
        }
        setPagination(data.pagination);
      } else {
        const { data } = await axios.get(`/api/projects?filter=${filter}&page=${page}&limit=${pagination.limit}`);
        
        if (page === 1) {
          setProjects(data.projects);
        } else {
          setProjects(prev => [...prev, ...data.projects]);
        }
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchProjects(pagination.page + 1);
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} />
      
      <div className="feed-header">
        <h2>Project Feed</h2>
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
          <button
            className={`tab ${filter === 'trending' ? 'active' : ''}`}
            onClick={() => setFilter('trending')}
          >
            Trending
          </button>
          <button
            className={`tab ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Google Ad - Top Banner */}
      <GoogleAd 
        slot="1234567890" 
        format="horizontal"
        style={{ marginTop: '1rem' }}
      />

      <div id="feedContainer">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found. Try adjusting your search filters.</p>
        ) : (
          <>
            {projects.map((project, index) => (
              <div key={project._id}>
                <ProjectPost
                  project={project}
                  onUpdate={() => fetchProjects(1)}
                />
                {/* Show Google Ad after every 3 projects */}
                {(index + 1) % 3 === 0 && (
                  <GoogleAd 
                    slot="9876543210" 
                    format="auto"
                  />
                )}
              </div>
            ))}
            
            {pagination.hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : `Load More (${pagination.total - projects.length} remaining)`}
                </button>
              </div>
            )}
            
            {!pagination.hasMore && projects.length > 0 && (
              <p className="end-of-feed">You've reached the end! 🎉</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Feed;
