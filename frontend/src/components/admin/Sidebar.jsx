/* eslint-disable react/prop-types */
import React from 'react';

function MenuItem({ item, activeTab, setActiveTab }) {
  return (
    <button
      type="button"
      onClick={() => setActiveTab(item.id)}
      className={`admin-menu-item ${activeTab === item.id ? 'active' : ''}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.8rem',
        padding: '0.7rem 1rem', fontSize: '0.9rem', fontWeight: 500,
        cursor: 'pointer', width: '100%',
        color: activeTab === item.id ? 'var(--primary)' : 'var(--muted)',
        borderLeft: `3px solid ${activeTab === item.id ? 'var(--primary)' : 'transparent'}`,
        background: activeTab === item.id ? 'rgba(59,130,246,0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        textAlign: 'left', fontFamily: 'inherit', border: 'none',
        marginBottom: '0.3rem'
      }}
      onMouseEnter={(e) => {
        if (activeTab !== item.id) {
          e.currentTarget.style.color = 'rgb(249,250,251)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderLeftColor = 'var(--primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (activeTab !== item.id) {
          e.currentTarget.style.color = 'var(--muted)';
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderLeftColor = 'transparent';
        }
      }}
    >
      <i className={`bx ${item.icon}`} style={{ fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}></i>
      <div style={{ flex: 1 }}>
        <div style={{ lineHeight: 1.2 }}>{item.label}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', opacity: 0.7 }}>{item.desc}</div>
      </div>
    </button>
  );
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const menuSections = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'bx-home-alt', desc: 'Overview' }
      ]
    },
    {
      label: 'Content',
      items: [
        { id: 'apps-list', label: 'Manage Apps', icon: 'bx-mobile-alt', desc: 'View & Edit' },
        { id: 'app-form', label: 'Add New App', icon: 'bx-plus-circle', desc: 'Create' }
      ]
    },
    {
      label: 'Engagement',
      items: [
        { id: 'manage-reviews', label: 'User Reviews', icon: 'bx-star', desc: 'Feedback' },
        { id: 'contact-messages', label: 'Contact Inbox', icon: 'bx-envelope', desc: 'Messages' }
      ]
    },
    {
      label: 'Configuration',
      items: [
        { id: 'premium-settings', label: 'Premium Pricing', icon: 'bxs-crown', desc: 'Tiers' },
        { id: 'site-settings', label: 'Site Settings', icon: 'bx-cog', desc: 'General' }
      ]
    }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Header */}
      <div className="admin-sidebar-header"> 
        <div className="admin-sidebar-brand">
          <i className='bx bx-cube-alt'></i>
          <span>diLA<span className="text-primary-gradient">Tech</span></span>
        </div>
        <span className="admin-sidebar-badge">Admin</span>
      </div>
      
      {/* User Profile */}
      {user && (
        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">
            <i className='bx bx-user-circle'></i>
          </div>
          <div className="admin-user-info">
            <div className="admin-user-name">{user.username || 'Admin'}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {menuSections.map((section) => (
          <div key={section.label} className="admin-nav-section">
            <div className="admin-nav-section-label">
              {section.label}
            </div>
            <div className="admin-nav-items">
              {section.items.map(item => (
                <MenuItem key={item.id} item={item} activeTab={activeTab} setActiveTab={setActiveTab} />
              ))}
            </div>
          </div>
        ))}

        {/* Quick Links */}
        <div className="admin-nav-quick-links">
          <div className="admin-nav-section-label">
            Links
          </div>
          <button
            type="button"
            onClick={() => globalThis.open('/', '_blank')}
            className="admin-menu-item admin-quick-link"
          >
            <i className='bx bx-link-external'></i>
            <div className="admin-menu-item-content">
              <div>View Website</div>
              <div>Live</div>
            </div>
          </button>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          onClick={onLogout}
          className="admin-logout-btn"
        >
          <i className='bx bx-log-out'></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// prop-types validation intentionally disabled to avoid extra dev dependency
