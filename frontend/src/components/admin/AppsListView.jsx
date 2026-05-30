/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import ExportPdfButton from './ExportPdfButton';
import { exportAppsPdf } from '../../lib/exportPdf';

export default function AppsListView({ apps, setActiveTab, onEdit, onDelete, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Manage <span className="text-primary-gradient">Apps</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>View, edit, and manage all your portfolio apps.</p>
        </div>
        <div className="admin-view-actions">
          <ExportPdfButton
            onClick={() => {
              exportAppsPdf(apps);
              showToast?.('Apps PDF downloaded.');
            }}
            disabled={!apps.length}
          />
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('app-form')}>
            <i className='bx bx-plus'></i> Add New App
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-body">
          <div style={{ position: 'relative' }}>
            <i className='bx bx-search' style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}></i>
            <input
              type="text"
              placeholder="Search apps by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Apps ({filteredApps.length})</h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Total: {apps.length}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>App</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Downloads</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', background: 'rgba(59, 130, 246, 0.1)' }}>
                        <i className={`bx ${app.iconBxi}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{app.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{app.shortDesc}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontWeight: 600, display: 'inline-block' }}>
                      {app.category || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--accent)' }}>★</span>
                      <span>{app.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>{app.downloads}+</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontWeight: 600, display: 'inline-block' }}>
                      ● Active
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        className="admin-action-btn view"
                        title="View"
                        onClick={() => globalThis.open(`/app/${app.id}`, '_blank')}
                      >
                        <i className='bx bx-link-external'></i>
                      </button>
                      <button
                        className="admin-action-btn edit"
                        title="Edit"
                        onClick={() => onEdit(app.id)}
                      >
                        <i className='bx bx-edit'></i>
                      </button>
                      <button
                        className="admin-action-btn delete"
                        title="Delete"
                        onClick={() => onDelete(app)}
                      >
                        <i className='bx bx-trash'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              <i className='bx bx-inbox' style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>{searchTerm ? 'No apps match your search.' : 'No apps yet. Create your first one!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
