import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ publishedApps: 3, downloads: '65k+', rating: 4.7, activeUsers: '2M+' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, reviewsRes, statsRes] = await Promise.all([
        api.get('/apps'),
        api.get('/site-data/reviews'),
        api.get('/site-data/site_stats'),
      ]);
      setApps(Array.isArray(appsRes.data) ? appsRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      // Fallback data for showcase
      setApps([
        { id: 1, name: 'Notes+', shortDesc: 'A premium note-taking experience.', rating: 4.8, downloads: '10k+', iconClass: 'ui-notes', iconBxi: 'bx-notepad' },
        { id: 2, name: 'FitTrack', shortDesc: 'Your ultimate fitness companion.', rating: 4.9, downloads: '25k+', iconClass: 'ui-fitness', iconBxi: 'bx-dumbbell' },
        { id: 3, name: 'FinDash', shortDesc: 'Personal finance made beautiful.', rating: 4.7, downloads: '50k+', iconClass: 'ui-finance', iconBxi: 'bx-line-chart' }
      ]);
      setReviews([
        { text: 'Incredible design and smooth performance.', name: 'Sarah J.', role: 'Designer', rating: 5, avatar: 'bx-user-circle' },
        { text: 'The best apps I have ever used.', name: 'Mike T.', role: 'Developer', rating: 5, avatar: 'bx-user-circle' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge"><i className='bx bx-code-alt'></i> Independent App Studio</span>
            <h1>We Craft <span className="text-primary-gradient">Exceptional</span> Digital Experiences</h1>
            <p>Building high-performance, beautifully designed mobile applications for Android & iOS. Used by millions worldwide.</p>
            <div className="hero-buttons">
              <a href="#portfolio" className="btn btn-primary">
                <i className='bx bx-compass'></i> Explore Portfolio
              </a>
              <a href="/contact" className="btn btn-outline">
                <i className='bx bx-envelope'></i> Hire Us
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-card c1"><i className='bx bx-mobile-alt'></i></div>
              <div className="graphic-card c2"><i className='bx bx-store-alt'></i></div>
              <div className="graphic-card c3"><i className='bx bx-bar-chart-alt-2'></i></div>
              <div className="ring-bg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Finance Section */}
      <section id="featured-finance" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="hero-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Finance Image */}
            <div style={{ textAlign: 'center', order: 2 }}>
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" 
                alt="Online Finance Dashboard" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  border: '2px solid var(--card-border)'
                }} 
              />
            </div>

            {/* Finance Content */}
            <div style={{ order: 1 }}>
              <span className="badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <i className='bx bx-wallet'></i> Finance Management
              </span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                Smart <span className="text-primary-gradient">Financial Control</span>
              </h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--muted-light)' }}>
                Our FinDash app brings professional-grade finance management to your fingertips. Track expenses, visualize spending patterns, and make smarter financial decisions with real-time insights.
              </p>
              
              <ul style={{ marginBottom: '2rem', paddingLeft: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <i className='bx bx-check-circle' style={{ marginRight: '0.8rem', color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                  <span>Real-time transaction tracking</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <i className='bx bx-check-circle' style={{ marginRight: '0.8rem', color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                  <span>Beautiful spending analytics & charts</span>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <i className='bx bx-check-circle' style={{ marginRight: '0.8rem', color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                  <span>Smart budget planning tools</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <i className='bx bx-check-circle' style={{ marginRight: '0.8rem', color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                  <span>Bank-level security & encryption</span>
                </li>
              </ul>

              <a href="#portfolio" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className='bx bx-compass'></i> View All Apps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Our Published <span className="text-primary-gradient">Applications</span></h2>
            <p>Click on any app to view its full details, features, and interactive galleries.</p>
          </div>
          <div className="apps-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : apps.length > 0 ? (
              apps.map(app => (
                <div key={app.id} className="app-card glass-card" onClick={() => navigate(`/app/${app.id}`)}>
                  <div className="app-icon-container">
                    <div className="app-icon" style={{ background: getIconGradient(app.iconClass) }}>
                      <i className={`bx ${app.iconBxi || 'bx-apps'}`}></i>
                    </div>
                  </div>
                  <h3>{app.name}</h3>
                  <p className="app-desc">{app.shortDesc}</p>
                  <div className="app-meta">
                    <span className="rating"><i className='bx bxs-star'></i> {app.rating}</span>
                    <span className="downloads"><i className='bx bx-download'></i> {app.downloads}+</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--muted)' }}>
                No apps found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-banner">
        <div className="container stats-container">
          <div className="stat-box">
            <h3>{stats.publishedApps}</h3>
            <p>Published Apps</p>
          </div>
          <div className="stat-box">
            <h3>{stats.downloads}</h3>
            <p>Total Downloads</p>
          </div>
          <div className="stat-box">
            <h3>{stats.rating}</h3>
            <p>Avg Rating</p>
          </div>
          <div className="stat-box">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" style={{ padding: '80px 0 120px' }}>
        <div className="container">
          <div className="section-header">
            <h2>What Our <span className="text-primary-gradient">Users Say</span></h2>
            <p>Real feedback from millions of users worldwide across all our applications.</p>
          </div>
          <div className="reviews-grid">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="review-card glass-card">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bx bxs-star ${i < (review.rating || 5) ? 'starred' : ''}`} style={{ opacity: i < (review.rating || 5) ? 1 : 0.3 }}></i>
                    ))}
                  </div>
                  <p>"{review.text}"</p>
                  <div className="review-author">
                    <strong>{review.name}</strong>
                    <small>{review.role || review.title}</small>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--muted)' }}>
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function getIconGradient(iconClass) {
  const gradients = {
    'ui-notes': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'ui-fitness': 'linear-gradient(135deg, #ef4444, #b91c1c)',
    'ui-finance': 'linear-gradient(135deg, #10b981, #047857)',
    'studio': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  };
  return gradients[iconClass] || 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
}
