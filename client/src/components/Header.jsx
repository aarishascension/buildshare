import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewPostModal from './NewPostModal';
import NotificationBell from './NotificationBell';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setShowMenu(!showMenu)}>
              ☰
            </button>
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Build<span>Share</span>
            </div>
          </div>
          <div className="nav-buttons">
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
        
        {/* Hamburger Menu Dropdown */}
        {showMenu && (
          <div className="hamburger-menu">
            <button className="menu-item" onClick={() => handleNavigate('/messages')}>
              💬 Messages
            </button>
            {user.userType === 'developer' && (
              <>
                <button className="menu-item" onClick={() => handleNavigate('/analytics')}>
                  📊 Analytics
                </button>
                <button className="menu-item" onClick={() => handleNavigate('/bookmarks')}>
                  🔖 Saved
                </button>
              </>
            )}
          </div>
        )}
      </header>
      {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Header;
