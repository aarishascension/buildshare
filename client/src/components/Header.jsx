import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewPostModal from './NewPostModal';
import NotificationBell from './NotificationBell';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  return (
    <>
      <header>
        <div className="header-content">
          <button 
            className="hamburger-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Build<span>Share</span>
          </div>
          
          <div className={`nav-buttons ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
            <button 
              className="close-menu-btn"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            
            <button className="btn btn-secondary" onClick={() => handleNavigation('/messages')}>
              💬 Messages
            </button>
            {user.userType === 'developer' && (
              <>
                <button className="btn btn-secondary" onClick={() => handleNavigation('/analytics')}>
                  📊 Analytics
                </button>
                <button className="btn btn-secondary" onClick={() => handleNavigation('/bookmarks')}>
                  🔖 Saved
                </button>
              </>
            )}
            <span 
              style={{ color: 'var(--cream)', marginRight: '1rem', cursor: 'pointer' }}
              onClick={() => handleNavigation('/profile')}
            >
              {user.name}
            </span>
            <NotificationBell />
            {user.userType === 'developer' && (
              <button className="btn btn-primary" onClick={() => { setShowModal(true); setShowMobileMenu(false); }}>
                Share Project
              </button>
            )}
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {showMobileMenu && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Header;
