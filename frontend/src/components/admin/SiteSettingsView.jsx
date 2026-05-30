/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { newId, siteStatsToRows, rowsToSiteStats } from '../../lib/adminCrud';
import ExportPdfButton from './ExportPdfButton';
import AdminModal from './AdminModal';
import { CrudActions, thStyle, tdStyle, trBorder } from './adminTableStyles';
import { exportSiteStatsPdf } from '../../lib/exportPdf';

const emptyMetric = () => ({
  id: newId('metric'),
  key: '',
  label: '',
  value: '',
});

async function persistMetrics(rows) {
  const value = rowsToSiteStats(rows);
  await api.post('/site-data/site_stats', { value });
  return value;
}

export default function SiteSettingsView({ showToast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyMetric());
  const [isEdit, setIsEdit] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingMetric, setPendingMetric] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/site-data/site_stats');
      setRows(siteStatsToRows(res.data || {}));
    } catch (err) {
      console.error(err);
      showToast('Failed to load site metrics.', true);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyMetric());
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setForm({ ...row });
    setIsEdit(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyMetric());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const key = form.key.trim().replace(/\s+/g, '');
    const label = form.label.trim() || key;
    if (!key) {
      showToast('Metric key is required.', true);
      return;
    }

    const duplicate = rows.some((r) => r.key === key && r.id !== form.id);
    if (duplicate) {
      showToast('This metric key already exists.', true);
      return;
    }

    try {
      const next = isEdit
        ? rows.map((r) => (r.id === form.id ? { ...form, key, label, id: key } : r))
        : [...rows, { ...form, key, label, id: key }];
      const value = await persistMetrics(next);
      setRows(siteStatsToRows(value));
      showToast(isEdit ? 'Metric updated.' : 'Metric added.');
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('Failed to save metric.', true);
    }
  };

    const handleDelete = (row) => {
    setPendingMetric(row);
    setShowConfirmModal(true);
  };

  const confirmDeleteMetric = async () => {
    if (!pendingMetric) return;
    try {
      const next = rows.filter((r) => r.id !== pendingMetric.id);
      await persist(next);
      showToast('Metric deleted');
      setShowConfirmModal(false);
      setPendingMetric(null);
    } catch (err) {
      showToast('Failed to delete metric', 'error');
      setShowConfirmModal(false);
      setPendingMetric(null);
    }
  };

  const cancelDeleteMetric = () => {
    setShowConfirmModal(false);
    setPendingMetric(null);
  };

  const handleExport = () => {
    exportToCsv(rows, 'site_stats');
  };

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Site Metrics <span className="text-primary-gradient">Settings</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Manage the statistics displayed on your homepage banner</p>
        </div>
        <div className="admin-view-actions">
          <ExportPdfButton
            label="📊 Export"
            onClick={() => {
              exportSiteStatsPdf(rowsToSiteStats(rows));
              showToast('Site stats PDF downloaded.');
            }}
            disabled={!rows.length}
          />
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <i className='bx bx-plus'></i> Add Metric
          </button>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-bar-chart-alt-2' style={{ color: 'var(--primary)' }}></i>
            Homepage Statistics
          </h3>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : rows.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{row.label}</strong></td>
                      <td><code style={{ fontSize: '0.85rem', color: 'var(--muted)', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{row.key}</code></td>
                      <td><span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{row.value}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="admin-action-btn edit" onClick={() => openEdit(row)} title="Edit">
                            <i className='bx bx-pencil'></i>
                          </button>
                          <button type="button" className="admin-action-btn delete" onClick={() => handleDelete(row)} title="Delete">
                            <i className='bx bx-trash'></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              <i className='bx bx-inbox' style={{ fontSize: '2rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}></i>
              No metrics configured yet. Create one to display statistics on your homepage.
            </div>
          )}
        </div>
      </div>

      {/* Metric Form Modal */}
      <AdminModal
        open={modalOpen}
        title={isEdit ? 'Edit Site Metric' : 'Add New Metric'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
            <button type="submit" form="metric-form" className="btn btn-primary">
              <i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>
              {isEdit ? 'Update Metric' : 'Create Metric'}
            </button>
          </>
        }
      >
        <form id="metric-form" onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Display Label <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" className="admin-form-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Published Apps, Total Downloads" required />
            <div className="admin-form-hint">How this metric appears on the homepage</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Key (Identifier) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              className="admin-form-input"
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value.replace(/\s/g, '') })}
              placeholder="e.g. publishedApps"
              required
              disabled={isEdit}
              style={{ opacity: isEdit ? 0.6 : 1 }}
            />
            <div className="admin-form-hint">Unique identifier (no spaces). {isEdit && 'Cannot be changed'}</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Value <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" className="admin-form-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 12, 250K+, 4.9★" required />
            <div className="admin-form-hint">The actual statistic value displayed</div>
          </div>
        </form>
      </AdminModal>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={cancelDeleteMetric}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>Delete Metric</h3>
            </div>
            <div className="custom-modal-body">
              <p>Are you sure you want to delete the metric "{pendingMetric?.label}"?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDeleteMetric}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteMetric}>
                <i className='bx bx-check'></i>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
