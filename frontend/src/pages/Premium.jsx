import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Premium() {
  const [premiumData, setPremiumData] = useState(null);
  const [billingMode, setBillingMode] = useState('monthly');

  const planDescriptions = {
    Starter: 'Perfect for getting your first premium workflow online.',
    Growth: 'Built for teams ready to scale faster with expert support.',
    Scale: 'A complete premium partnership for ambitious product growth.',
    Pro: 'Advanced tools and support for serious product builders.',
  };

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const fetchPremiumData = async () => {
    try {
      const res = await api.get('/site-data/premium_settings');
      setPremiumData(res.data);
    } catch (err) {
      console.error('Error loading premium data:', err);
      // Fallback
      setPremiumData({
        plans: [
          { name: 'Starter', priceMonthly: 0, priceYearly: 0, features: ['Basic Features', 'Community Support', 'Ad-Supported'] },
          { name: 'Pro', priceMonthly: 9, priceYearly: 89, features: ['Everything in Starter', 'Ad-Free Experience', 'Priority Support', 'Exclusive Content'] }
        ],
        features: ['Cloud Sync', 'Advanced Analytics', 'Early Access']
      });
    }
  };

  if (!premiumData) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  const { plans = [], features = [] } = premiumData;

  return (
    <div className="container">
      {/* Premium Hero */}
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge accent">
          <i className='bx bxs-crown'></i> Go Premium
        </span>
        <h1 style={{ marginTop: '1rem' }}>
          Unlock <span className="text-accent">Unlimited Potential</span>
        </h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto' }}>
          Get unlimited access to all our applications, advanced features, priority support, and exclusive content.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <span style={{ color: billingMode === 'monthly' ? 'white' : 'var(--muted)', fontWeight: billingMode === 'monthly' ? 'bold' : 'normal' }}>Monthly</span>
          <div 
            style={{ 
              width: '60px', height: '32px', background: billingMode === 'yearly' ? 'var(--accent)' : 'rgba(255,255,255,0.2)', 
              borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s'
            }}
            onClick={() => setBillingMode(billingMode === 'monthly' ? 'yearly' : 'monthly')}
          >
            <div style={{ 
              width: '24px', height: '24px', background: 'white', borderRadius: '50%', 
              position: 'absolute', top: '4px', left: billingMode === 'yearly' ? '32px' : '4px', transition: '0.3s'
            }}></div>
          </div>
          <span style={{ color: billingMode === 'yearly' ? 'white' : 'var(--muted)', fontWeight: billingMode === 'yearly' ? 'bold' : 'normal' }}>Yearly</span>
          <span className="badge accent" style={{ marginLeft: '1rem', fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>Save 20%</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 6rem' }}>
        {plans.map((plan, idx) => (
          <div key={idx} className={`glass-card price-card ${plan.name.toLowerCase() === 'pro' ? 'featured' : ''}`}>
            <h3>{plan.name}</h3>
            <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.25rem', minHeight: '2.8rem' }}>
              {planDescriptions[plan.name] || 'A flexible premium plan tailored to your needs.'}
            </p>
            <div className="price">
              ${billingMode === 'monthly' ? plan.priceMonthly : (plan.priceYearly / 12).toFixed(0)}
              <span>/mo</span>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              {billingMode === 'monthly' ? 'Billed monthly' : `$${plan.priceYearly} billed annually`}
            </p>

            <ul>
              {plan.features && plan.features.map((feature, fidx) => (
                <li key={fidx}>
                  <i className='bx bx-check-circle'></i>
                  <span style={{ color: 'white' }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`btn ${plan.name.toLowerCase() === 'pro' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', marginTop: 'auto' }}>
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Premium <span className="text-accent">Benefits</span></h2>
        <p style={{ marginBottom: '3rem' }}>Everything included in all Premium plans</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {features && features.map((feature, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '15px', 
                background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '2rem', marginBottom: '1rem' 
              }}>
                <i className='bx bx-star'></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
