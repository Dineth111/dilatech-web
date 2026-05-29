import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="container">
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge">Legal</span>
        <h1 style={{ marginTop: '1rem' }}>
          Terms & <span className="text-primary-gradient">Conditions</span>
        </h1>
        <p style={{ maxWidth: '720px', margin: '1rem auto' }}>
          These terms govern the use of the diLA Tech Solution website, services, and related
          digital products.
        </p>
      </div>

      <div className="prose-stack" style={{ maxWidth: '900px', margin: '0 auto 6rem' }}>
        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <p>
            <strong style={{ color: 'white' }}>Effective date:</strong> May 28, 2026
          </p>
          <p>
            By using this website or contacting diLA Tech Solution through our services, you
            agree to these Terms & Conditions.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Use of Services</h2>
          <p>
            You agree to use our website and services only for lawful purposes. You must not
            misuse the platform, interfere with security, or attempt unauthorized access to any
            part of the site or related systems.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Intellectual Property</h2>
          <p>
            All branding, content, designs, interface elements, and software materials on this
            website are owned by or licensed to diLA Tech Solution unless otherwise stated. You
            may not reproduce or redistribute them without permission.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>User Submissions</h2>
          <p>
            Information you submit through contact forms or similar features must be accurate and
            must not contain unlawful, harmful, abusive, or misleading content.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Third-Party Services</h2>
          <p>
            Our website or apps may rely on third-party tools, hosting providers, analytics
            services, or external platforms. We are not responsible for the policies or
            availability of third-party services outside our direct control.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Limitation of Liability</h2>
          <p>
            We provide our website and services on an as-available basis. To the fullest extent
            permitted by law, diLA Tech Solution is not liable for indirect, incidental, or
            consequential damages arising from the use of the site or related services.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms & Conditions from time to time. Continued use of the
            website after changes take effect means you accept the updated terms.
          </p>
        </div>

        <div className="cta-panel glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Need Clarification?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Reach out if you have any questions about these terms.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
