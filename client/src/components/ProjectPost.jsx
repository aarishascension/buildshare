import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProjectUpdates from './ProjectUpdates';
import './ProjectPost.css';

function ProjectPost({ project, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState('');
  const [showResponses, setShowResponses] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  const isOwner = user && project.user._id === user.id;

  const lookingForText = {
    'full-time': 'Looking for Full-Time',
    'contract': 'Open to Contract Work',
    'freelance': 'Available for Freelance',
    'feedback': 'Open to Feedback'
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleSave = async () => {
    try {
      await axios.post(`/api/projects/${project._id}/save`);
      onUpdate?.();
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      await axios.post(`/api/projects/${project._id}/responses`, {
        content: responseText
      });
      setResponseText('');
      onUpdate?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to post response');
    }
  };

  const handleHelpful = async (responseId) => {
    try {
      await axios.post(`/api/projects/${project._id}/responses/${responseId}/helpful`);
      onUpdate?.();
    } catch (error) {
      alert('Failed to mark as helpful');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/projects/${project._id}`);
      onUpdate?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleMessageAuthor = async () => {
    try {
      await axios.post('/api/messages', {
        recipientId: project.user._id,
        content: `Hi ${project.user.name}, I'm interested in your project "${project.title}"`
      });
      navigate('/messages');
    } catch (error) {
      alert('Failed to start conversation');
    }
  };

  const handleMessageResponder = async (responder) => {
    try {
      await axios.post('/api/messages', {
        recipientId: responder._id,
        content: `Hi ${responder.name}!`
      });
      navigate('/messages');
    } catch (error) {
      alert('Failed to start conversation');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/projects/${project._id}`;
    const shareText = `Check out this project: ${project.title} by ${project.user.name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  return (
    <div className="post fade-in">
      <div className="post-header">
        <div className="user-info">
          <div className="avatar" onClick={() => navigate(`/profile/${project.user._id}`)} style={{ cursor: 'pointer' }}>
            {project.user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-details" onClick={() => navigate(`/profile/${project.user._id}`)} style={{ cursor: 'pointer' }}>
            <h3>{project.user.name}</h3>
            <div className="user-title">{project.user.title || 'Developer'}</div>
          </div>
          {!isOwner && (
            <button className="btn-message-small" onClick={handleMessageAuthor} title="Message author">
              💬
            </button>
          )}
        </div>
        <h2 className="project-title">{project.title}</h2>
        <div className="post-meta">
          <span>📍 {project.user.location || 'Remote'}</span>
          <span>🕐 {formatTimeAgo(project.createdAt)}</span>
          <span>🔍 {lookingForText[project.lookingFor]}</span>
        </div>
      </div>

      <div className="post-body">
        <p className="project-description">{project.description}</p>

        {project.images && project.images.length > 0 && (
          <div className={`project-images-grid grid-${project.images.length}`}>
            {project.images.map((image, index) => (
              <div key={index} className="project-image-container">
                <img src={image} alt={`${project.title} - ${index + 1}`} className="project-image" />
              </div>
            ))}
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className="project-tags">
            {project.technologies.map(tech => (
              <span key={tech} className="project-tag">{tech}</span>
            ))}
          </div>
        )}

        {(project.demoUrl || project.githubUrl) && (
          <div className="project-links">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                🔗 Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                📦 GitHub
              </a>
            )}
          </div>
        )}

        <div className="post-actions">
          <button className="action-btn" onClick={() => setShowResponses(!showResponses)}>
            💬 {project.responses.length} {project.responses.length === 1 ? 'Response' : 'Responses'}
          </button>
          <button className="action-btn" onClick={() => setShowUpdates(!showUpdates)}>
            📝 Updates
          </button>
          <button className="action-btn" onClick={handleSave}>
            🔖 Save
          </button>
          <button className="action-btn" onClick={handleShare}>
            📤 Share
          </button>
          {isOwner && (
            <button className="action-btn delete-btn" onClick={handleDelete}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {showUpdates && (
        <ProjectUpdates projectId={project._id} isOwner={isOwner} />
      )}

      {showResponses && (
        <div className="responses-section">
          <div className="responses-header">
            {project.responses.length === 0 ? 'No responses yet' : `${project.responses.length} Employer ${project.responses.length === 1 ? 'Response' : 'Responses'}`}
          </div>

          {project.responses.map(response => (
            <div key={response._id} className="response">
              <div className="response-header">
                <div className="response-avatar">
                  {response.user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="response-user">
                  <h4>{response.user.name}</h4>
                  <div className="company-badge">
                    🏢 {response.user.company || 'Company'}
                  </div>
                </div>
                {response.user._id !== user.id && (
                  <button 
                    className="btn-message-small" 
                    onClick={() => handleMessageResponder(response.user)}
                    title="Message"
                  >
                    💬
                  </button>
                )}
              </div>
              <div className="response-content">{response.content}</div>
              <div className="response-actions">
                <button className="response-btn" onClick={() => handleHelpful(response._id)}>
                  👍 Helpful ({response.helpful?.length || 0})
                </button>
                <button className="response-btn" onClick={() => handleMessageResponder(response.user)}>
                  💬 Reply
                </button>
              </div>
            </div>
          ))}

          {user.userType === 'employer' && (
            <div className="new-response">
              <form onSubmit={handleResponse}>
                <textarea
                  placeholder="Reply as an employer..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
                <button type="submit" className="response-submit">
                  Post Response
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectPost;
