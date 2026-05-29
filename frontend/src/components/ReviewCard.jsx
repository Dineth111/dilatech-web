export default function ReviewCard({ review }) {
  const rating = Math.min(5, Math.max(1, review.rating || 5));
  const role = review.role || review.title || 'User';
  const avatar = review.avatar || 'bx-user-circle';

  return (
    <article className="review-card glass-card">
      <div className="review-card-top">
        <div className="review-avatar" aria-hidden="true">
          <i className={`bx ${avatar}`} />
        </div>
        <div className="stars" aria-label={`${rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`bx bxs-star ${i < rating ? 'starred' : ''}`}
              style={{ opacity: i < rating ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>
      <p>&ldquo;{review.text}&rdquo;</p>
      <div className="review-author">
        <strong>{review.name}</strong>
        <small>{role}</small>
      </div>
    </article>
  );
}
