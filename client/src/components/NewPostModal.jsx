import { useState } from 'react';
import axios from 'axios';
import './Modal.css';

function NewPostModal({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [],
    demoUrl: '',
    githubUrl: '',
    lookingFor: 'full-time'
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/projects', formData);
      onProjectCreated?.(data);
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create project');
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          technologies: [...formData.technologies, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tag)
    });
  };

  return (
    <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Share Your Project</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="E.g., AI-Powered Recipe Generator"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Tell us about your project, what you built, and the tech stack you used..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Project Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="imageUpload"
            />
            {!imagePreview ? (
              <label htmlFor="imageUpload" className="image-upload-label">
                <div className="image-upload-placeholder">
                  <span style={{ fontSize: '48px' }}>📷</span>
                  <p>Click to upload image</p>
                  <small>Max size: 2MB</small>
                </div>
              </label>
            ) : (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button type="button" className="remove-image" onClick={removeImage}>
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Technologies</label>
            <div className="tags-input" onClick={() => document.getElementById('tagInput').focus()}>
              {formData.technologies.map(tag => (
                <div key={tag} className="tag">
                  {tag} <span className="tag-remove" onClick={() => removeTag(tag)}>×</span>
                </div>
              ))}
              <input
                type="text"
                id="tagInput"
                className="tag-input"
                placeholder="Add technologies (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Live Demo URL (optional)</label>
            <input
              type="url"
              placeholder="https://your-project-demo.com"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>GitHub Repository (optional)</label>
            <input
              type="url"
              placeholder="https://github.com/username/project"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Looking For</label>
            <select
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
            >
              <option value="full-time">Full-Time Opportunities</option>
              <option value="contract">Contract Work</option>
              <option value="freelance">Freelance Projects</option>
              <option value="feedback">Feedback & Collaboration</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Publish Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPostModal;
