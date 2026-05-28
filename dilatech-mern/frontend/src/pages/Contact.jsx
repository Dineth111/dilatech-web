import { useState } from 'react';
import { api } from '../lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact', formData);

      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.response?.data?.error || err.message || 'Failed to send message. Please try again.',
      });
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge">Get in Touch</span>
        <h1 style={{ marginTop: '1rem' }}>Let's Build Something <span className="text-primary-gradient">Amazing</span></h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto' }}>
          Whether you have a question, a project idea, or just want to say hi, we'd love to hear from you.
        </p>
      </div>

      <div className="contact-layout" style={{ maxWidth: '1000px', margin: '0 auto 6rem' }}>
        <div className="contact-stack" style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="glass-card contact-info-card" style={{ padding: '2.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#60a5fa', marginBottom: '1rem' }}>
              <i className='bx bx-envelope'></i>
            </div>
            <h3>Email Us</h3>
            <p>For general inquiries and project proposals.</p>
            <a href="mailto:dilshanrathnayaka089@gmail.com" style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '0.5rem', display: 'inline-block' }}>dilshanrathnayaka089@gmail.com</a>
          </div>

          <div className="glass-card contact-info-card" style={{ padding: '2.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#34d399', marginBottom: '1rem' }}>
              <i className='bx bx-message-square-dots'></i>
            </div>
            <h3>Support</h3>
            <p>Need help with one of our apps?</p>
            <a href="mailto:dilshanrathnayaka089@gmail.com" style={{ color: 'var(--secondary)', fontWeight: '600', marginTop: '0.5rem', display: 'inline-block' }}>dilshanrathnayaka089@gmail.com</a>
          </div>
        </div>

        <div className="glass-card form-card" style={{ padding: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
          <form onSubmit={handleSubmit} method="POST" style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="How can we help you?"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            {status && (
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: status.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                fontWeight: '500'
              }}>
                <i className={`bx ${status.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}`} style={{ marginRight: '8px' }}></i>
                {status.message}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> Sending...</>
              ) : (
                <>Send Message <i className='bx bx-send'></i></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
