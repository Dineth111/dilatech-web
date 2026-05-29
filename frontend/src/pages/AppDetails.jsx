import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

function getIconGradient(iconClass) {
  const gradients = {
    'ui-notes': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'ui-fitness': 'linear-gradient(135deg, #ef4444, #b91c1c)',
    'ui-finance': 'linear-gradient(135deg, #10b981, #047857)',
    'studio': 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
  };
  return gradients[iconClass] || 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
}

function getCategoryColor(category) {
  const colors = {
    'Productivity': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
    'Finance': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    'Health': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
    'Education': { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
    'Lifestyle': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' }
  };
  return colors[category] || { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' };
}

export default function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchApp();
  }, [id]);

  const fetchApp = async () => {
    try {
      const res = await api.get(`/apps/${id}`);
      setApp(res.data);
    } catch (err) {
      console.error('Error loading app:', err);
      if (id === '1') {
        setApp({
          name: 'Notes+', shortDesc: 'A premium note-taking experience.',
          fullDesc: 'Notes+ is designed to keep your thoughts organized. With powerful tagging, cloud sync, and a beautiful minimalist interface, you can focus on what matters most.',
          rating: 4.8, downloads: '10k+', iconClass: 'ui-notes', iconBxi: 'bx-notepad',
          version: '2.4.1', size: '32 MB', category: 'Productivity',
          features: ['Cloud Sync', 'Markdown Support', 'Dark Mode', 'Widgets']
        });
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction) => {
    if (!app?.screenshots) return;
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < app.screenshots.length) {
      setLightboxIndex(newIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  if (loading) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  if (!app) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <i className='bx bx-error-circle' style={{ fontSize: '4rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }}></i>
        <h2>App Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>The app you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          <i className='bx bx-home'></i> Back to Home
        </button>
      </div>
    );
  }

  const categoryStyle = getCategoryColor(app.category);

  return (
    <div className="container">
      {/* Modern Hero Section */}
      <div className="modern-app-hero">
        <div className="hero-phone-mockup">
          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-screen-content" style={{ background: getIconGradient(app.iconClass) }}>
                <i className={`bx ${app.iconBxi || 'bx-apps'}`}></i>
              </div>
            </div>
          </div>
          <div className="phone-glow" style={{ background: getIconGradient(app.iconClass) }}></div>
        </div>

        <div className="hero-app-info">
          <div className="app-badge-row">
            {app.category && (
              <span className="modern-category-badge" style={{ 
                background: categoryStyle.bg, 
                color: categoryStyle.color,
                border: `1px solid ${categoryStyle.border}`
              }}>
                <i className='bx bx-category'></i>
                {app.category}
              </span>
            )}
            <span className="app-version-badge">v{app.version || '1.0'}</span>
          </div>

          <h1 className="modern-app-title">{app.name}</h1>
          <p className="modern-app-tagline">{app.shortDesc}</p>

          <div className="modern-stats-row">
            <div className="stat-pill">
              <i className='bx bxs-star'></i>
              <span className="stat-value">{app.rating}</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat-pill">
              <i className='bx bx-download'></i>
              <span className="stat-value">{app.downloads}</span>
              <span className="stat-label">Downloads</span>
            </div>
            <div className="stat-pill">
              <i className='bx bx-package'></i>
              <span className="stat-value">{app.size || '25 MB'}</span>
              <span className="stat-label">Size</span>
            </div>
          </div>

          <div className="modern-download-buttons">
            {app.playStoreUrl && (
              <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer" className="modern-store-btn play-store">
                <i className='bx bxl-play-store'></i>
                <div className="btn-text">
                  <small>GET IT ON</small>
                  <strong>Google Play</strong>
                </div>
              </a>
            )}
            {app.appStoreUrl && (
              <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="modern-store-btn app-store">
                <i className='bx bxl-apple'></i>
                <div className="btn-text">
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="app-modern-content">
        {/* About & Features Grid */}
        <div className="content-grid-main">
          <div className="modern-card about-card">
            <div className="card-header">
              <div className="header-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
                <i className='bx bx-info-circle'></i>
              </div>
              <h2>About This App</h2>
            </div>
            <div className="card-body">
              <p className="about-text">{app.fullDesc || app.shortDesc}</p>
            </div>
          </div>

          {/* Screenshots Section - Inline */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="modern-card screenshots-inline-card">
              <div className="card-header">
                <div className="header-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent)' }}>
                  <i className='bx bx-images'></i>
                </div>
                <h2>Screenshots</h2>
              </div>
              <div className="card-body">
                <div className="inline-screenshots-grid">
                  {app.screenshots.map((screenshot, index) => (
                    <div 
                      key={index} 
                      className="inline-screenshot-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => openLightbox(index)}
                    >
                      <img 
                        src={screenshot.src || screenshot} 
                        alt={screenshot.label || `Screenshot ${index + 1}`} 
                        className="inline-screenshot-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="inline-screenshot-placeholder" style={{ display: 'none' }}>
                        <i className='bx bx-image'></i>
                        <span>Image not available</span>
                      </div>
                      {screenshot.label && (
                        <div className="inline-screenshot-label">{screenshot.label}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {app.features && app.features.length > 0 && (
            <div className="modern-card features-card">
              <div className="card-header">
                <div className="header-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)' }}>
                  <i className='bx bx-check-shield'></i>
                </div>
                <h2>Key Features</h2>
              </div>
              <div className="card-body">
                <div className="modern-features-list">
                  {app.features.map((feature, index) => (
                    <div className="modern-feature-item" key={feature} style={{ animationDelay: `${index * 0.08}s` }}>
                      <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
                      <div className="feature-content">
                        <strong>{feature}</strong>
                      </div>
                      <div className="feature-check">
                        <i className='bx bx-check'></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="content-sidebar">
          <div className="modern-card info-card">
            <div className="card-header">
              <div className="header-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                <i className='bx bx-info-square'></i>
              </div>
              <h2>App Info</h2>
            </div>
            <div className="card-body">
              <div className="info-details-list">
                <div className="info-detail-item">
                  <div className="detail-icon">
                    <i className='bx bx-code-alt'></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Version</span>
                    <span className="detail-value">{app.version || '1.0'}</span>
                  </div>
                </div>
                <div className="info-detail-item">
                  <div className="detail-icon">
                    <i className='bx bx-package'></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Size</span>
                    <span className="detail-value">{app.size || '25 MB'}</span>
                  </div>
                </div>
                <div className="info-detail-item highlight">
                  <div className="detail-icon">
                    <i className='bx bxs-star'></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Rating</span>
                    <span className="detail-value rating-highlight">
                      <i className='bx bxs-star'></i>
                      {app.rating}
                    </span>
                  </div>
                </div>
                <div className="info-detail-item">
                  <div className="detail-icon">
                    <i className='bx bx-download'></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Downloads</span>
                    <span className="detail-value">{app.downloads || 'N/A'}</span>
                  </div>
                </div>
                {app.category && (
                  <div className="info-detail-item">
                    <div className="detail-icon">
                      <i className='bx bx-category'></i>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">
                        <span className="category-badge-small" style={{ 
                          background: categoryStyle.bg, 
                          color: categoryStyle.color,
                          border: `1px solid ${categoryStyle.border}`
                        }}>
                          {app.category}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="modern-back-section">
        <button onClick={() => navigate('/')} className="modern-back-btn">
          <i className='bx bx-arrow-back'></i>
          <span>Back to Portfolio</span>
        </button>
      </div>

      {/* Screenshot Lightbox */}
      {lightboxOpen && app?.screenshots && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className='bx bx-x'></i>
            </button>

            {/* Navigation Buttons */}
            {lightboxIndex > 0 && (
              <button className="lightbox-nav lightbox-prev" onClick={() => navigateLightbox(-1)}>
                <i className='bx bx-chevron-left'></i>
              </button>
            )}
            {lightboxIndex < app.screenshots.length - 1 && (
              <button className="lightbox-nav lightbox-next" onClick={() => navigateLightbox(1)}>
                <i className='bx bx-chevron-right'></i>
              </button>
            )}

            {/* Image Display */}
            <div className="lightbox-image-container">
              <img 
                src={app.screenshots[lightboxIndex].src || app.screenshots[lightboxIndex]} 
                alt={app.screenshots[lightboxIndex].label || `Screenshot ${lightboxIndex + 1}`} 
                className="lightbox-image"
              />
              {app.screenshots[lightboxIndex].label && (
                <div className="lightbox-caption">
                  <i className='bx bx-image'></i>
                  {app.screenshots[lightboxIndex].label}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {app.screenshots.length > 1 && (
              <div className="lightbox-thumbnails">
                {app.screenshots.map((screenshot, idx) => (
                  <div 
                    key={idx}
                    className={`lightbox-thumb ${idx === lightboxIndex ? 'active' : ''}`}
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img 
                      src={screenshot.src || screenshot} 
                      alt={screenshot.label || `Thumbnail ${idx + 1}`} 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {app.screenshots.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


