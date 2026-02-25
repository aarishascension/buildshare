import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProjectUpdates.css';

function ProjectUpdates({ projectId, isOwner }) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    version: '',
    updateType: 'announcement'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, [projectId]);

  const fetchUpdates = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${projectId}/updates`);
      setUpdates(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/projects/${projectId}/updates`, formData);
      setUpdates([data, ...updates]);
      setFormData({ title: '', content: '', version: '', updateType: 'announcement' });
      setShowForm(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to post update');
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'feature': return '✨';
      case 'bugfix': return '🐛';
      case 'improvement': return '⚡';
      default: return '📢';
    }
  };

  const getUpdateColor = (type) => {
    switch (type) {
      case 'feature': return '#4CAF50';
      case 'bugfix': return '#f44336';
      case 'improvement': return '#2196F3';
      default: return '#d4a574';
    }
  };

  if (loading) return <div className="updates-loading">Loading updates...</div>;

  return (
    <div className="project-updates">
      <div className="updates-header">
        <h3>📝 Project Updates</h3>
        {isOwner && (
          <button 
            className="btn-post-update"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Post Update'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="update-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Update title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <textarea
            placeholder="What's new?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows="4"
          />
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Version (optional, e.g., v1.2.0)"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            />
            
            <select
              value={formData.updateType}
              onChange={(e) => setFormData({ ...formData, updateType: e.target.value })}
            >
              <option value="announcement">📢 Announcement</option>
              <option value="feature">✨ New Feature</option>
              <option value="bugfix">🐛 Bug Fix</option>
              <option value="improvement">⚡ Improvement</option>
            </select>
          </div>
          
          <button type="submit" className="btn-submit-update">
            Post Update
          </button>
        </form>
      )}

      <div className="updates-list">
        {updates.length === 0 ? (
          <p className="no-updates">No updates yet. {isOwner && 'Be the first to post one!'}</p>
        ) : (
          updates.map(update => (
            <div key={update._id} className="update-item">
              <div className="update-header">
                <div className="update-type" style={{ color: getUpdateColor(update.updateType) }}>
                  <span className="update-icon">{getUpdateIcon(update.updateType)}</span>
                  <span className="update-type-text">
                    {update.updateType.charAt(0).toUpperCase() + update.updateType.slice(1)}
                  </span>
                </div>
                {update.version && (
                  <span className="update-version">{update.version}</span>
                )}
              </div>
              
              <h4 className="update-title">{update.title}</h4>
              <p className="update-content">{update.content}</p>
              
              <div className="update-footer">
                <span className="update-author">by {update.user.name}</span>
                <span className="update-date">
                  {new Date(update.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectUpdates;
