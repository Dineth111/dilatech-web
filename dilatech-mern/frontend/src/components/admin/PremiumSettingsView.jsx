import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function PremiumSettingsView({ showToast }) {
  const [formData, setFormData] = useState({
    monthly: '',
    yearly: '',
    discount: '',
    features: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/site-data/premium_settings');
      if (res.data) {
        setFormData({
          monthly: res.data.monthly || '',
          yearly: res.data.yearly || '',
          discount: res.data.discount || '',
          features: res.data.features || []
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site-data/premium_settings', {
        value: {
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        }
      });
      showToast('💰 Premium settings updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update premium settings.', true);
    }
  };

  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage <span className="text-primary-gradient">Premium Pricing</span></h1>
      </div>

      <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Monthly Price ($)</label>
              <input type="text" name="monthly" value={formData.monthly} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Yearly Price (Effective Monthly) ($)</label>
              <input type="text" name="yearly" value={formData.yearly} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Yearly Discount Label (%)</label>
              <input type="text" name="discount" value={formData.discount} onChange={handleChange} required className="form-control" placeholder="e.g. 40" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Premium Features List</label>
              {formData.features.map((feat, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" className="form-control" style={{ flex: 1 }} value={feat} onChange={(e) => updateFeature(index, e.target.value)} />
                  <button type="button" onClick={() => removeFeature(index)} className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)' }}><i className='bx bx-x'></i></button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData(p => ({ ...p, features: [...p.features, ''] }))} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <i className='bx bx-plus'></i> Add Feature
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="submit" className="btn btn-primary"><i className='bx bx-save'></i> Save Prices</button>
          </div>
        </form>
      </div>
    </div>
  );
}
