import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function ManageReviewsView({ showToast }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/site-data/reviews');
      if (res.data && Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addReview = () => {
    setReviews([{ name: '', title: '', text: '', rating: 5, avatar: 'bx-user' }, ...reviews]);
  };

  const removeReview = (index) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const updateReview = (index, field, value) => {
    const newReviews = [...reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setReviews(newReviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site-data/reviews', {
        value: reviews.filter(r => r.name.trim() !== '')
      });
      showToast('⭐ Reviews updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update reviews.', true);
    }
  };

  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage <span className="text-primary-gradient">User Reviews</span></h1>
        <button className="btn btn-primary btn-sm" onClick={addReview} type="button">
          <i className='bx bx-plus'></i> Add New Review
        </button>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map((rev, index) => (
              <div key={index} className="glass-card" style={{ padding: '1.5rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>User Name</label>
                    <input type="text" value={rev.name} onChange={(e) => updateReview(index, 'name', e.target.value)} required className="form-control" placeholder="John Doe" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Role / Title</label>
                    <input type="text" value={rev.title || rev.role || ''} onChange={(e) => updateReview(index, 'title', e.target.value)} required className="form-control" placeholder="Verified Buyer" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={rev.rating} onChange={(e) => updateReview(index, 'rating', parseInt(e.target.value))} required className="form-control" />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Review Text</label>
                  <textarea value={rev.text} onChange={(e) => updateReview(index, 'text', e.target.value)} required className="form-control" placeholder="The app is great..."></textarea>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Icon (Boxicons class)</label>
                    <input type="text" value={rev.avatar} onChange={(e) => updateReview(index, 'avatar', e.target.value)} className="form-control" placeholder="bx-user" />
                  </div>
                  <button type="button" onClick={() => removeReview(index)} className="btn btn-outline" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)' }}>
                    <i className='bx bx-trash'></i> Remove
                  </button>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                No reviews found. Click "Add New Review" to create one.
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="submit" className="btn btn-primary"><i className='bx bx-save'></i> Save All Reviews</button>
          </div>
        </form>
      </div>
    </div>
  );
}
