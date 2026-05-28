import React from 'react';

export default function AppsListView({ apps, setActiveTab, onEdit, onDelete }) {
  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage <span className="text-primary-gradient">Apps</span></h1>
        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('app-form')}>
          <i className='bx bx-plus'></i> Add New App
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>All Apps</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>App</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Rating</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Downloads</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', background: 'rgba(255,255,255,0.1)' }}>
                      <i className={`bx ${app.iconBxi}`}></i>
                    </div>
                    <span>{app.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--muted)' }}>{app.category}</span>
                </td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>★ {app.rating}</span></td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>{app.downloads}+</td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => window.open(`/apps/${app.id}`, '_blank')}
                      style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <i className='bx bx-link-external'></i>
                    </button>
                    <button 
                      onClick={() => onEdit(app.id)}
                      style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <i className='bx bx-edit'></i>
                    </button>
                    <button 
                      onClick={() => onDelete(app)}
                      style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <i className='bx bx-trash'></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apps.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>No apps found.</div>
        )}
      </div>
    </div>
  );
}
