import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ReviewCard from '../components/ReviewCard';

function averageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  return (sum / reviews.length).toFixed(1);
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get('/site-data/reviews')
      .then((res) => {
        if (active) {
          setReviews(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        console.error('Error loading reviews:', err);
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const avg = averageRating(reviews);
  const fiveStarCount = reviews.filter((r) => (r.rating || 5) >= 5).length;

  return (
    <div className="container">
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge">
          <i className="bx bx-star" /> User Reviews
        </span>
        <h1 style={{ marginTop: '1rem' }}>
          What Our <span className="text-primary-gradient">Users Say</span>
        </h1>
        <p style={{ maxWidth: '640px', margin: '1rem auto' }}>
          Real feedback from people who use our applications. Reviews are curated by our team and updated regularly.
        </p>
      </div>

      {!loading && reviews.length > 0 && (
        <div className="reviews-summary glass-card">
          <div className="reviews-summary-stat">
            <span className="reviews-summary-value">{avg}</span>
            <span className="reviews-summary-label">Average rating</span>
          </div>
          <div className="reviews-summary-stat">
            <span className="reviews-summary-value">{reviews.length}</span>
            <span className="reviews-summary-label">Total reviews</span>
          </div>
          <div className="reviews-summary-stat">
            <span className="reviews-summary-value">{fiveStarCount}</span>
            <span className="reviews-summary-label">5-star reviews</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="reviews-page-loader">
          <div className="spinner" />
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="reviews-grid" style={{ marginBottom: '6rem' }}>
          {reviews.map((review, idx) => (
            <ReviewCard key={`${review.name}-${idx}`} review={review} />
          ))}
        </div>
      ) : (
        <div className="glass-card reviews-empty" style={{ marginBottom: '6rem' }}>
          <i className="bx bx-message-square-dots" />
          <h2>No reviews yet</h2>
          <p>Check back soon — we&apos;re collecting feedback from our users.</p>
          <Link to="/" className="btn btn-primary">
            <i className="bx bx-home" /> Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
