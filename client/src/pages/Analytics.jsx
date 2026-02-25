import { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading analytics...</div>;
  if (!analytics) return <div className="container">No analytics data available</div>;

  return (
    <div className="container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your performance and engagement</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card highlight">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total Views</h3>
            <div className="card-number">{analytics.totalViews}</div>
            <p className="card-subtitle">Across all projects</p>
          </div>
        </div>

        <div className="analytics-card highlight">
          <div className="card-icon">💬</div>
          <div className="card-content">
            <h3>Total Responses</h3>
            <div className="card-number">{analytics.totalResponses}</div>
            <p className="card-subtitle">From employers</p>
          </div>
        </div>

        <div className="analytics-card highlight">
          <div className="card-icon">🔖</div>
          <div className="card-content">
            <h3>Total Saves</h3>
            <div className="card-number">{analytics.totalSaves}</div>
            <p className="card-subtitle">Projects bookmarked</p>
          </div>
        </div>

        <div className="analytics-card highlight">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Engagement Rate</h3>
            <div className="card-number">{analytics.engagementRate}%</div>
            <p className="card-subtitle">Response rate</p>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Project Performance</h2>
        <div className="projects-analytics">
          {analytics.projectStats.map(project => (
            <div key={project._id} className="project-analytics-card">
              <h3>{project.title}</h3>
              <div className="project-stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Views</span>
                  <span className="stat-value">{project.views || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Responses</span>
                  <span className="stat-value">{project.responseCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Saves</span>
                  <span className="stat-value">{project.saveCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Engagement</span>
                  <span className="stat-value">{project.engagementRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Top Technologies</h2>
        <div className="tech-chart">
          {analytics.topTechnologies.map((tech, index) => (
            <div key={index} className="tech-bar">
              <span className="tech-name">{tech.name}</span>
              <div className="tech-bar-container">
                <div 
                  className="tech-bar-fill" 
                  style={{ width: `${(tech.count / analytics.topTechnologies[0].count) * 100}%` }}
                >
                  <span className="tech-count">{tech.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Recent Activity</h2>
        <div className="activity-timeline">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'response' ? '💬' : 
                 activity.type === 'save' ? '🔖' : 
                 activity.type === 'view' ? '👁️' : '📢'}
              </div>
              <div className="activity-content">
                <p className="activity-text">{activity.message}</p>
                <span className="activity-time">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
