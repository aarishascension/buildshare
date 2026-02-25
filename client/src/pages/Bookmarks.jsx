import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectPost from '../components/ProjectPost';
import './Bookmarks.css';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
    fetchCollections();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get('/api/bookmarks');
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get('/api/collections');
      setCollections(data);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      await axios.post('/api/collections', { name: newCollectionName });
      setNewCollectionName('');
      setShowNewCollection(false);
      fetchCollections();
    } catch (error) {
      alert('Failed to create collection');
    }
  };

  const addToCollection = async (projectId, collectionId) => {
    try {
      await axios.post(`/api/collections/${collectionId}/projects`, { projectId });
      fetchCollections();
    } catch (error) {
      alert('Failed to add to collection');
    }
  };

  const toggleCollectionSharing = async (collectionId, isPublic) => {
    try {
      await axios.put(`/api/collections/${collectionId}/share`, { isPublic });
      fetchCollections();
      alert(isPublic ? 'Collection is now public!' : 'Collection is now private');
    } catch (error) {
      alert('Failed to update collection sharing');
    }
  };

  const copyShareLink = (collectionId) => {
    const shareUrl = `${window.location.origin}/collections/shared/${collectionId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const filteredBookmarks = selectedCollection === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.collections?.includes(selectedCollection));

  if (loading) return <div className="container">Loading bookmarks...</div>;

  return (
    <div className="container">
      <div className="bookmarks-header">
        <h1>Saved Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowNewCollection(true)}>
          + New Collection
        </button>
      </div>

      {showNewCollection && (
        <div className="new-collection-form">
          <form onSubmit={createCollection}>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              autoFocus
            />
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowNewCollection(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="collections-tabs">
        <button
          className={`collection-tab ${selectedCollection === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCollection('all')}
        >
          All Saved ({bookmarks.length})
        </button>
        {collections.map(collection => (
          <div key={collection._id} className="collection-tab-wrapper">
            <button
              className={`collection-tab ${selectedCollection === collection._id ? 'active' : ''}`}
              onClick={() => setSelectedCollection(collection._id)}
            >
              📁 {collection.name} ({collection.projects.length})
            </button>
            {selectedCollection === collection._id && (
              <button
                className="share-collection-btn"
                onClick={() => toggleCollectionSharing(collection._id, !collection.isPublic)}
                title={collection.isPublic ? 'Make private' : 'Make public'}
              >
                {collection.isPublic ? '🔓' : '🔒'}
              </button>
            )}
            {collection.isPublic && selectedCollection === collection._id && (
              <button
                className="copy-link-btn"
                onClick={() => copyShareLink(collection._id)}
                title="Copy share link"
              >
                🔗
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bookmarks-grid">
        {filteredBookmarks.length === 0 ? (
          <p className="empty-state">No saved projects yet. Start bookmarking projects you like!</p>
        ) : (
          filteredBookmarks.map(bookmark => (
            <div key={bookmark._id} className="bookmark-item">
              <ProjectPost project={bookmark} onUpdate={fetchBookmarks} />
              {collections.length > 0 && (
                <div className="bookmark-actions">
                  <select
                    onChange={(e) => addToCollection(bookmark._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Add to collection...</option>
                    {collections.map(col => (
                      <option key={col._id} value={col._id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
