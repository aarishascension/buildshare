import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProjectPost from '../components/ProjectPost';
import GoogleAd from '../components/GoogleAd';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ projectCount: 0, totalResponses: 0, totalSaves: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/users/${userId || currentUser.id}`);
      setProfile(data.user);
      setProjects(data.projects);
      setStats(data.stats);
      setEditForm({
        name: data.user.name,
        title: data.user.title,
        location: data.user.location,
        bio: data.user.bio || '',
        company: data.user.company
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', editForm);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!profile) return <div className="container">User not found</div>;

  const isOwnProfile = currentUser.id === profile.id;

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profile.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Location"
              />
              {profile.userType === 'employer' && (
                <input
                  type="text"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  placeholder="Company"
                />
              )}
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Bio"
                rows="3"
              />
              <div className="profile-edit-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1>{profile.name}</h1>
              <p className="profile-title">{profile.title}</p>
              <div className="profile-meta">
                <span>📍 {profile.location}</span>
                <span className={`badge ${profile.userType}`}>{profile.userType}</span>
                {profile.company && <span>🏢 {profile.company}</span>}
              </div>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              {isOwnProfile && (
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.projectCount}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalResponses}</div>
          <div className="stat-label">Responses</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalSaves}</div>
          <div className="stat-label">Saves</div>
        </div>
      </div>

      {/* Google Ad - Profile Page */}
      <GoogleAd 
        slot="1122334455" 
        format="horizontal"
      />

      <div className="profile-projects">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p className="empty-state">No projects yet</p>
        ) : (
          projects.map(project => (
            <ProjectPost key={project._id} project={project} onUpdate={fetchProfile} />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
