/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { newId } from '../../lib/adminCrud';
import ExportPdfButton from './ExportPdfButton';
import AdminModal from './AdminModal';
import { CrudActions, thStyle, tdStyle, trBorder } from './adminTableStyles';
import { exportReviewsPdf } from '../../lib/exportPdf';

const emptyReview = () => ({
  id: newId('review'),
  name: '',
  title: '',
  text: '',
  rating: 5,
  avatar: 'bx-user-circle',
});

async function saveReviews(reviews) {
  const payload = reviews
    .filter((r) => r.name?.trim())
    .map(({ id, name, title, role, text, rating, avatar }) => ({
      id,
      name: name.trim(),
      title: (title || role || '').trim(),
      text: text.trim(),
      rating: Number(rating) || 5,
      avatar: avatar || 'bx-user-circle',
    }));
  await api.post('/site-data/reviews', { value: payload });
  return payload;
}

export default function ManageReviewsView({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState(emptyReview());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReview, setPendingReview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/site-data/reviews');
      const list = Array.isArray(res.data) ? res.data : [];
      setReviews(
        list.map((r, i) => ({
          ...r,
          id: r.id || newId(`review-${i}`),
          title: r.title || r.role || '',
        }))
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews.', true);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyReview());
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (review) => {
    setForm({ ...review, title: review.title || review.role || '' });
    setIsEdit(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyReview());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      showToast('Name and review text are required.', true);
      return;
    }

    try {
      const next = isEdit
        ? reviews.map((r) => (r.id === form.id ? { ...form } : r))
        : [{ ...form }, ...reviews];
      const saved = await saveReviews(next);
      setReviews(saved);
      showToast(isEdit ? 'Review updated.' : 'Review added.');
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('Failed to save review.', true);
    }
  };

  const handleDelete = (review) => {
    setPendingReview(review);
    setShowConfirmModal(true);
  };

  const confirmDeleteReview = async () => {
    if (!pendingReview) return;
    try {
      const next = reviews.filter((r) => r.id !== pendingReview.id);
      const saved = await saveReviews(next);
      setReviews(saved);
      showToast('Review deleted');
      setShowConfirmModal(false);
      setPendingReview(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete review', 'error');
      setShowConfirmModal(false);
      setPendingReview(null);
    }
  };

  const cancelDeleteReview = () => {
    setShowConfirmModal(false);
    setPendingReview(null);
  };

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">User <span className="text-primary-gradient">Reviews</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Display customer testimonials and reviews on your website</p>
        </div>
        <div className="admin-view-actions">
          <ExportPdfButton
            label="📊 Export"
            onClick={() => {
              if (!reviews.length) {
                showToast('No reviews to export.', true);
                return;
              }
              exportReviewsPdf(reviews);
              showToast('Reviews PDF downloaded.');
            }}
            disabled={!reviews.length}
          />
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <i className='bx bx-plus'></i> Add Review
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-star' style={{ color: 'var(--accent)' }}></i>
            Customer Reviews
          </h3>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : reviews.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role / Title</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{rev.name}</strong></td>
                      <td><span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{rev.title || rev.role || '-'}</span></td>
                      <td><span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1rem' }}>★ {rev.rating}</span></td>
                      <td>
                        <div style={{ maxWidth: '200px', fontSize: '0.9rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          &quot;{rev.text?.length > 60 ? `${rev.text.slice(0, 60)}…` : rev.text}&quot;
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="admin-action-btn view" onClick={() => setViewItem(rev)} title="View">
                            <i className='bx bx-eye'></i>
                          </button>
                          <button type="button" className="admin-action-btn edit" onClick={() => openEdit(rev)} title="Edit">
                            <i className='bx bx-pencil'></i>
                          </button>
                          <button type="button" className="admin-action-btn delete" onClick={() => handleDelete(rev)} title="Delete">
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
              <i className='bx bx-comment-detail' style={{ fontSize: '2rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}></i>
              No reviews yet. Add customer testimonials to build social proof.
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      <AdminModal
        open={modalOpen}
        title={isEdit ? 'Edit Customer Review' : 'Add New Review'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
            <button type="submit" form="review-form" className="btn btn-primary">
              <i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>
              {isEdit ? 'Update Review' : 'Create Review'}
            </button>
          </>
        }
      >
        <form id="review-form" onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" className="admin-form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
              <div className="admin-form-hint">Reviewer's name</div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Role / Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" className="admin-form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="CEO, XYZ Company" required />
              <div className="admin-form-hint">Job title or company</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Rating <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select className="admin-form-select" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })} required>
                <option value={5}>★★★★★ Excellent (5)</option>
                <option value={4}>★★★★☆ Very Good (4)</option>
                <option value={3}>★★★☆☆ Good (3)</option>
                <option value={2}>★★☆☆☆ Fair (2)</option>
                <option value={1}>★☆☆☆☆ Poor (1)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Avatar Icon</label>
              <input type="text" className="admin-form-input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="bx-user-circle" />
              <div className="admin-form-hint">Boxicon class name</div>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Review Text <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea className="admin-form-textarea" rows={5} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Share the customer's testimonial or feedback..." required />
            <div className="admin-form-hint">{form.text.length}/500 characters</div>
          </div>
        </form>
      </AdminModal>

      {/* Review Details Modal */}
      <AdminModal open={!!viewItem} title="Review Details" onClose={() => setViewItem(null)}>
        {viewItem && (
          <div style={{ display: 'grid', gap: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <i className={`bx ${viewItem.avatar}`} style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                <div>
                  <div style={{ fontWeight: 700, color: 'white' }}>{viewItem.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{viewItem.title || viewItem.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{'★'.repeat(viewItem.rating)}{'☆'.repeat(5 - viewItem.rating)}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{viewItem.rating}.0 / 5.0</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Review:</div>
              <p style={{ color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>&quot;{viewItem.text}&quot;</p>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={cancelDeleteReview}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>Delete Review</h3>
            </div>
            <div className="custom-modal-body">
              <p>Are you sure you want to delete the review from "{pendingReview?.name}"?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDeleteReview}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteReview}>
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
