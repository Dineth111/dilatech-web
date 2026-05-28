import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bx-home-alt' },
    { id: 'apps-list', label: 'Manage Apps', icon: 'bx-mobile-alt' },
    { id: 'app-form', label: 'Add New App', icon: 'bx-plus-circle' },
    { id: 'premium-settings', label: 'Premium Pricing', icon: 'bxs-crown' },
    { id: 'site-settings', label: 'Site Settings', icon: 'bx-cog' },
    { id: 'manage-reviews', label: 'User Reviews', icon: 'bx-star' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15,23,42,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 100,
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '1.3rem', fontWeight: 800 }}>
        <i className='bx bx-cube-alt'></i> diLA<span className="text-primary-gradient">Tech</span>
        <span style={{
          fontSize: '0.7rem',
          background: 'rgba(245,158,11,0.15)',
          color: 'var(--accent)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '50px',
          padding: '0.15rem 0.6rem',
          marginLeft: '0.5rem',
          verticalAlign: 'middle'
        }}>Admin</span>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', padding: '0.5rem 1.5rem' }}>
          Menu
        </div>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.8rem',
              padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 500,
              cursor: 'pointer',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--muted)',
              borderLeft: `3px solid ${activeTab === item.id ? 'var(--primary)' : 'transparent'}`,
              background: activeTab === item.id ? 'rgba(59,130,246,0.08)' : 'transparent',
              transition: 'all 0.25s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.color = 'var(--muted)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <i className={`bx ${item.icon}`} style={{ fontSize: '1.2rem', width: '22px' }}></i>
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', padding: '0.5rem 1.5rem', marginTop: '1rem' }}>
          Links
        </div>
        <div
          onClick={() => window.open('/', '_blank')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 500,
            cursor: 'pointer', color: 'var(--muted)', borderLeft: '3px solid transparent',
            transition: 'all 0.25s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <i className='bx bx-link-external' style={{ fontSize: '1.2rem', width: '22px' }}></i>
          <span>View Website</span>
        </div>
      </nav>

      <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem',
            color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none',
            fontFamily: 'inherit', width: '100%', padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
        >
          <i className='bx bx-log-out'></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
