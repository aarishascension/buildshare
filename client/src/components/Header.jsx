import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewPostModal from './NewPostModal';
import NotificationBell from './NotificationBell';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Build<span>Share</span>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-secondary" onClick={() => navigate('/messages')}>
              💬 Messages
            </button>
            {user.userType === 'developer' && (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
                  📊 Analytics
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/bookmarks')}>
                  🔖 Saved
                </button>
              </>
            )}
            <span 
              style={{ color: 'var(--cream)', marginRight: '1rem', cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {user.name}
            </span>
            <NotificationBell />
            {user.userType === 'developer' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Share Project
              </button>
            )}
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Header;
