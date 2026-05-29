/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { newId } from '../../lib/adminCrud';
import ExportPdfButton from './ExportPdfButton';
import AdminModal from './AdminModal';
import { CrudActions, thStyle, tdStyle, trBorder } from './adminTableStyles';
import { exportContactMessagesPdf } from '../../lib/exportPdf';

const emptyMessage = () => ({
  id: newId('msg'),
  name: '',
  email: '',
  message: '',
  createdAt: new Date().toISOString(),
});

async function saveMessages(messages) {
  await api.post('/site-data/contact_messages', { value: messages });
}

export default function ContactMessagesView({ showToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyMessage());
  const [isEdit, setIsEdit] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/site-data/contact_messages');
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(
        list.map((m, i) => ({
          ...m,
          id: m.id || newId(`msg-${i}`),
        }))
      );
    } catch (err) {
      console.error(err);
      showToast?.('Failed to load contact messages.', true);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyMessage());
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (msg) => {
    setForm({ ...msg });
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('All fields are required.', true);
      return;
    }
    try {
      const entry = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        createdAt: form.createdAt || new Date().toISOString(),
      };
      const next = isEdit
        ? messages.map((m) => (m.id === form.id ? entry : m))
        : [entry, ...messages];
      await saveMessages(next);
      setMessages(next);
      showToast(isEdit ? 'Message updated.' : 'Message added.');
      setModalOpen(false);
    } catch (err) {
      showToast('Failed to save message.', true);
    }
  };

    const handleDelete = (msg) => {
    setPendingMessage(msg);
    setShowConfirmModal(true);
  };

  const confirmDeleteMessage = async () => {
    if (!pendingMessage) return;
    try {
      const next = messages.filter((m) => m.id !== pendingMessage.id);
      await saveMessages(next);
      setMessages(next);
      showToast('Message deleted');
      setShowConfirmModal(false);
      setPendingMessage(null);
    } catch (err) {
      showToast('Failed to delete message', 'error');
      setShowConfirmModal(false);
      setPendingMessage(null);
    }
  };

  const cancelDeleteMessage = () => {
    setShowConfirmModal(false);
    setPendingMessage(null);
  };

  const handleExport = () => {
    if (!messages.length) {
      showToast?.('No messages to export.', true);
      return;
    }
    exportContactMessagesPdf(messages);
    showToast?.('PDF downloaded.');
  };

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Contact <span className="text-primary-gradient">Inbox</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Manage contact form submissions and visitor messages</p>
        </div>
        <div className="admin-view-actions">
          <button type="button" className="btn btn-outline" onClick={fetchMessages} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className='bx bx-refresh'></i> Refresh
          </button>
          <ExportPdfButton
            label="📊 Export"
            onClick={handleExport}
            disabled={!messages.length}
          />
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <i className='bx bx-plus'></i> Add Note
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-envelope' style={{ color: 'var(--primary)' }}></i>
            Inbox Messages ({messages.length})
          </h3>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : messages.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td><strong style={{ color: 'var(--primary)' }}>{msg.name}</strong></td>
                      <td>
                        <a href={`mailto:${msg.email}`} style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                          {msg.email}
                        </a>
                      </td>
                      <td>
                        <div style={{ maxWidth: '200px', fontSize: '0.9rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.message?.length > 50 ? `${msg.message.slice(0, 50)}…` : msg.message}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="admin-action-btn view" onClick={() => setViewItem(msg)} title="View">
                            <i className='bx bx-eye'></i>
                          </button>
                          <button type="button" className="admin-action-btn edit" onClick={() => openEdit(msg)} title="Edit">
                            <i className='bx bx-pencil'></i>
                          </button>
                          <button type="button" className="admin-action-btn delete" onClick={() => handleDelete(msg)} title="Delete">
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
              Your inbox is empty. Contact form submissions will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Message Form Modal */}
      <AdminModal
        open={modalOpen}
        title={isEdit ? 'Edit Message' : 'Add New Note'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" form="contact-form" className="btn btn-primary">
              <i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>
              {isEdit ? 'Update Message' : 'Create Note'}
            </button>
          </>
        }
      >
        <form id="contact-form" onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" className="admin-form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
            <div className="admin-form-hint">Sender's name</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="email" className="admin-form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required />
            <div className="admin-form-hint">Contact email address</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Message <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea className="admin-form-textarea" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message content..." required />
            <div className="admin-form-hint">{form.message.length}/2000 characters</div>
          </div>
        </form>
      </AdminModal>

      {/* Message Details Modal */}
      <AdminModal open={!!viewItem} title="Message Details" onClose={() => setViewItem(null)}>
        {viewItem && (
          <div style={{ display: 'grid', gap: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Date</span>
                  <div style={{ fontWeight: 700 }}>
                    {viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : '-'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>From</span>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{viewItem.name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Email</span>
                  <div>
                    <a href={`mailto:${viewItem.email}`} style={{ color: 'var(--secondary)', textDecoration: 'none' }}>
                      {viewItem.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Message</span>
              <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {viewItem.message}
              </p>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={cancelDeleteMessage}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>Delete Message</h3>
            </div>
            <div className="custom-modal-body">
              <p>Are you sure you want to delete the message from "{pendingMessage?.name}"?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDeleteMessage}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteMessage}>
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
