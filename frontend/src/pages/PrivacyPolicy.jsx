import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge">Legal</span>
        <h1 style={{ marginTop: '1rem' }}>
          Privacy <span className="text-primary-gradient">Policy</span>
        </h1>
        <p style={{ maxWidth: '720px', margin: '1rem auto' }}>
          This page explains how diLA Tech Solution collects, uses, and protects information
          when you use our website, contact forms, and mobile applications.
        </p>
      </div>

      <div className="prose-stack" style={{ maxWidth: '900px', margin: '0 auto 6rem' }}>
        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <p>
            <strong style={{ color: 'white' }}>Effective date:</strong> May 28, 2026
          </p>
          <p>
            diLA Tech Solution values your privacy. We aim to collect only the information
            needed to provide our services, improve user experience, and respond to inquiries.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Information We Collect</h2>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.8rem' }}>
              Contact details you submit, such as your name, email address, and message.
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              Basic usage data, including browser, device, and interaction details.
            </li>
            <li>
              App-related technical information needed for performance, support, and security.
            </li>
          </ul>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>How We Use Information</h2>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.8rem' }}>To respond to messages and support requests.</li>
            <li style={{ marginBottom: '0.8rem' }}>To improve our website, apps, and user experience.</li>
            <li style={{ marginBottom: '0.8rem' }}>To monitor performance, reliability, and security.</li>
            <li>To communicate important updates related to our services.</li>
          </ul>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Data Sharing</h2>
          <p>
            We do not sell personal information. We may share limited data with trusted service
            providers that help us operate our website, forms, analytics, hosting, or app
            infrastructure, only when necessary for service delivery.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Data Security</h2>
          <p>
            We use reasonable technical and organizational safeguards to protect data from
            unauthorized access, misuse, or disclosure. However, no online system can be
            guaranteed as completely secure.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Your Rights</h2>
          <p>
            You may request access, correction, or deletion of personal information you have
            shared with us, subject to legal and operational requirements.
          </p>
        </div>

        <div className="cta-panel glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Questions About Privacy?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Contact us if you need clarification about how your data is handled.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
