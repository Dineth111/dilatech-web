import React, { useState, useEffect } from 'react';

const ICON_OPTIONS = [
  { value: 'ui-notes|bx-wallet-alt', label: '💰 Finance / Wallet' },
  { value: 'ui-fitness|bx-book-open', label: '📖 Education / Book' },
  { value: 'ui-finance|bx-conversation', label: '💬 Chat / Conversation' },
  { value: 'ui-notes|bx-edit', label: '✏️ Notes / Edit' },
  { value: 'ui-fitness|bx-dumbbell', label: '💪 Fitness / Health' },
  { value: 'ui-finance|bx-heart', label: '❤️ Health / Wellness' },
  { value: 'ui-notes|bx-music', label: '🎵 Music / Audio' },
  { value: 'ui-fitness|bx-camera', label: '📷 Photo / Camera' },
  { value: 'ui-finance|bx-map', label: '🗺️ Travel / Maps' },
  { value: 'ui-notes|bx-game', label: '🎮 Games / Fun' },
  { value: 'ui-fitness|bx-code-alt', label: '💻 Tools / Productivity' },
  { value: 'ui-finance|bx-store-alt', label: '🛍️ Shopping / Store' },
];

export default function AppFormView({ app, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    iconClass: 'ui-notes',
    iconBxi: 'bx-wallet-alt',
    playStoreUrl: '',
    rating: '4.5',
    downloads: '0',
    shortDesc: '',
    fullDesc: '',
    features: [],
    screenshots: [],
    specs: []
  });

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || '',
        category: app.category || '',
        iconClass: app.iconClass || 'ui-notes',
        iconBxi: app.iconBxi || 'bx-wallet-alt',
        playStoreUrl: app.playStoreUrl || app.playUrl || '',
        rating: app.rating || '4.5',
        downloads: app.downloads || '0',
        shortDesc: app.shortDesc || '',
        fullDesc: app.fullDesc || app.description || '',
        features: app.features || [],
        screenshots: app.screenshots || [],
        specs: app.specs || []
      });
    } else {
      setFormData({
        name: '', category: '', iconClass: 'ui-notes', iconBxi: 'bx-wallet-alt',
        playStoreUrl: '', rating: '4.5', downloads: '0', shortDesc: '', fullDesc: '',
        features: [{ title: '', desc: '' }],
        screenshots: [{ label: '', src: '' }],
        specs: [
          { label: 'Version', value: '' },
          { label: 'Requires Android', value: '8.0 and up' }
        ]
      });
    }
  }, [app]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (e) => {
    const [iconClass, iconBxi] = e.target.value.split('|');
    setFormData(prev => ({ ...prev, iconClass, iconBxi }));
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    if (typeof newArray[index] === 'string') {
      newArray[index] = value;
    } else {
      newArray[index] = { ...newArray[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName, newItem) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], newItem] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFeatures = formData.features.filter(f => typeof f === 'string' ? f.trim() !== '' : (f.title?.trim() !== '' || f.desc?.trim() !== ''));
    const cleanScreenshots = formData.screenshots.filter(s => s.label?.trim() !== '' || s.src?.trim() !== '');
    const cleanSpecs = formData.specs.filter(s => s.label?.trim() !== '');
    
    onSave({
      ...formData,
      id: app?.id || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      features: cleanFeatures,
      screenshots: cleanScreenshots,
      specs: cleanSpecs
    });
  };

  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{app ? 'Edit' : 'Add'} <span className="text-primary-gradient">{app ? app.name : 'New App'}</span></h1>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>App Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" placeholder="e.g. English Journey" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Category <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="form-control">
                <option value="">Select category...</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Productivity">Productivity</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>App Icon <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select value={`${formData.iconClass}|${formData.iconBxi}`} onChange={handleIconChange} className="form-control">
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Google Play URL</label>
              <input type="text" name="playStoreUrl" value={formData.playStoreUrl} onChange={handleChange} className="form-control" placeholder="https://play.google.com/..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Rating</label>
              <input type="text" name="rating" value={formData.rating} onChange={handleChange} className="form-control" placeholder="4.8" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Downloads</label>
              <input type="text" name="downloads" value={formData.downloads} onChange={handleChange} className="form-control" placeholder="50k+" />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Short Description <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Full Description <span style={{ color: 'var(--danger)' }}>*</span></label>
              <textarea name="fullDesc" value={formData.fullDesc} onChange={handleChange} required className="form-control" style={{ minHeight: '110px' }}></textarea>
            </div>

            {/* Features */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Key Features</label>
              {formData.features.map((feat, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Feature Title" value={feat.title || (typeof feat === 'string' ? feat : '')} onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)} />
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Description (optional)" value={feat.desc || ''} onChange={(e) => updateArrayItem('features', index, 'desc', e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('features', index)} className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)' }}><i className='bx bx-x'></i></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('features', { title: '', desc: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <i className='bx bx-plus'></i> Add Feature
              </button>
            </div>

            {/* Screenshots */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Screenshots</label>
              {formData.screenshots.map((scr, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Image URL / Path" value={scr.src || (typeof scr === 'string' ? scr : '')} onChange={(e) => updateArrayItem('screenshots', index, 'src', e.target.value)} />
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Label (optional)" value={scr.label || ''} onChange={(e) => updateArrayItem('screenshots', index, 'label', e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('screenshots', index)} className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)' }}><i className='bx bx-x'></i></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('screenshots', { src: '', label: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <i className='bx bx-image-add'></i> Add Screenshot
              </button>
            </div>

            {/* Specs */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Tech Specs</label>
              {formData.specs.map((spec, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" className="form-control" style={{ maxWidth: '200px' }} placeholder="Label" value={spec.label || ''} onChange={(e) => updateArrayItem('specs', index, 'label', e.target.value)} />
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Value" value={spec.value || ''} onChange={(e) => updateArrayItem('specs', index, 'value', e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('specs', index)} className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)' }}><i className='bx bx-x'></i></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('specs', { label: '', value: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <i className='bx bx-plus'></i> Add Spec Row
              </button>
            </div>

          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className='bx bx-save'></i> Save App</button>
          </div>
        </form>
      </div>
    </div>
  );
}
