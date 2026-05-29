/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control, react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';

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

export default function AppFormView({ app, onSave, onCancel, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    iconClass: 'ui-notes',
    iconBxi: 'bx-wallet-alt',
    playStoreUrl: '',
    appStoreUrl: '',
    rating: '4.5',
    downloads: '0',
    shortDesc: '',
    fullDesc: '',
    features: [],
    screenshots: [],
    specs: []
  });
  
  // Track screenshot input methods (url or file)
  const [screenshotMethods, setScreenshotMethods] = useState({});
  const fileInputRefs = useRef({});
  
  // Custom confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || '',
        category: app.category || '',
        iconClass: app.iconClass || 'ui-notes',
        iconBxi: app.iconBxi || 'bx-wallet-alt',
        playStoreUrl: app.playStoreUrl || app.playUrl || '',
        appStoreUrl: app.appStoreUrl || '',
        rating: app.rating || '4.5',
        downloads: app.downloads || '0',
        shortDesc: app.shortDesc || '',
        fullDesc: app.fullDesc || app.description || '',
        features: app.features || [],
        screenshots: app.screenshots || [],
        specs: app.specs || []
      });
      // Initialize screenshot methods for existing screenshots
      const methods = {};
      (app.screenshots || []).forEach((_, idx) => {
        methods[idx] = 'url';
      });
      setScreenshotMethods(methods);
    } else {
      setFormData({
        name: '', category: '', iconClass: 'ui-notes', iconBxi: 'bx-wallet-alt',
        playStoreUrl: '', appStoreUrl: '', rating: '4.5', downloads: '0', shortDesc: '', fullDesc: '',
        features: [{ title: '', desc: '' }],
        screenshots: [{ label: '', src: '' }],
        specs: [
          { label: 'Version', value: '' },
          { label: 'Requires Android', value: '8.0 and up' }
        ]
      });
      setScreenshotMethods({ 0: 'url' });
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
    const newIndex = formData[arrayName].length;
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], newItem] }));
    if (arrayName === 'screenshots') {
      setScreenshotMethods(prev => ({ ...prev, [newIndex]: 'url' }));
    }
  };

  const handleScreenshotMethodChange = (index, method) => {
    setScreenshotMethods(prev => ({ ...prev, [index]: method }));
    // Clear the src when switching methods
    const newArray = [...formData.screenshots];
    newArray[index] = { ...newArray[index], src: '' };
    setFormData(prev => ({ ...prev, screenshots: newArray }));
  };

  // Custom confirmation modal handlers
  const handleRemoveScreenshot = (index, label) => {
    setPendingRemoval({ index, label });
    setShowConfirmModal(true);
  };

  const confirmRemoveScreenshot = () => {
    if (pendingRemoval) {
      removeArrayItem('screenshots', pendingRemoval.index);
      setShowConfirmModal(false);
      setPendingRemoval(null);
    }
  };

  const cancelRemoveScreenshot = () => {
    setShowConfirmModal(false);
    setPendingRemoval(null);
  };

  const handleScreenshotFileUpload = async (index, file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast?.('Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.', 'error');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast?.('File too large. Maximum size is 5MB.', 'error');
      return;
    }
    
    const formDataObj = new FormData();
    formDataObj.append('screenshot', file);
    
    try {
      showToast?.('Uploading screenshot...', 'info');
      
      const response = await api.post('/upload/screenshot', formDataObj, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const newArray = [...formData.screenshots];
        newArray[index] = { ...newArray[index], src: response.data.url };
        setFormData(prev => ({ ...prev, screenshots: newArray }));
        showToast?.('Screenshot uploaded successfully!', 'success');
        console.log('Uploaded file URL:', response.data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // User-friendly error messages
      let userMessage = 'Failed to upload screenshot';
      
      if (error.response?.status === 413) {
        userMessage = 'File is too large. Please choose a smaller image (max 5MB).';
      } else if (error.response?.status === 400) {
        userMessage = error.response?.data?.error || 'Invalid file. Please try again.';
      } else if (error.response?.status === 500) {
        userMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        userMessage = 'Connection error. Please check your internet and try again.';
      } else {
        userMessage = error.response?.data?.error || 'Upload failed. Please try again.';
      }
      
      showToast?.(userMessage, 'error');
    }
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
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">{app ? 'Edit' : 'Add New'} <span className="text-primary-gradient">{app ? app.name : 'App'}</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>{app ? 'Update app details' : 'Create a new app for your portfolio'}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            
            {/* Basic Info Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className='bx bx-info-circle' style={{ color: 'var(--primary)' }}></i>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">App Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admin-form-input" placeholder="e.g. English Journey" />
                  <div className="admin-form-hint">Must be unique and descriptive</div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="admin-form-select">
                    <option value="">Select category...</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-form-label">App Icon <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select value={`${formData.iconClass}|${formData.iconBxi}`} onChange={handleIconChange} className="admin-form-select">
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="admin-form-hint">Choose an icon that represents your app</div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Short Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleChange} required className="admin-form-input" placeholder="One-line description" />
                  <div className="admin-form-hint">Shown in app previews</div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Full Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <textarea name="fullDesc" value={formData.fullDesc} onChange={handleChange} required className="admin-form-textarea" placeholder="Detailed description of your app..."></textarea>
                  <div className="admin-form-hint">Detailed info for the details page</div>
                </div>
              </div>
            </div>

            {/* Store & Metrics Section */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className='bx bx-store-alt' style={{ color: 'var(--secondary)' }}></i>
                Store & Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                <div className="admin-form-group">
                  <label className="admin-form-label">Google Play URL</label>
                  <input type="text" name="playStoreUrl" value={formData.playStoreUrl} onChange={handleChange} className="admin-form-input" placeholder="https://play.google.com/..." />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Rating</label>
                  <input type="number" name="rating" value={formData.rating} onChange={handleChange} className="admin-form-input" placeholder="4.8" min="0" max="5" step="0.1" />
                  <div className="admin-form-hint">0.0 - 5.0</div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Downloads</label>
                  <input type="text" name="downloads" value={formData.downloads} onChange={handleChange} className="admin-form-input" placeholder="50k+" />
                  <div className="admin-form-hint">e.g. 50k+, 1M+</div>
                </div>

              </div>
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className='bx bx-sparkles' style={{ color: 'var(--accent)' }}></i>
                  Key Features
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.features.map((feat, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '0.5rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <input type="text" className="admin-form-input" placeholder="Feature title" value={feat.title || (typeof feat === 'string' ? feat : '')} onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)} />
                    <input type="text" className="admin-form-input" placeholder="Description (optional)" value={feat.desc || ''} onChange={(e) => updateArrayItem('features', index, 'desc', e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('features', index)} className="admin-action-btn delete" style={{ height: '36px' }}>
                      <i className='bx bx-x'></i>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('features', { title: '', desc: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  <i className='bx bx-plus'></i> Add Feature
                </button>
              </div>
            </div>

            {/* Screenshots Section */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className='bx bx-image-add' style={{ color: 'var(--primary)' }}></i>
                  Screenshots
                </h3>
                {formData.screenshots.length > 0 && (
                  <div className="screenshot-count-badge">
                    <i className='bx bx-images'></i>
                    {formData.screenshots.length} {formData.screenshots.length === 1 ? 'image' : 'images'}
                  </div>
                )}
              </div>
              
              {/* Input Method Info */}
              <div style={{ 
                padding: '1rem 1.25rem', 
                background: 'rgba(59, 130, 246, 0.08)', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                borderRadius: '10px', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <i className='bx bx-info-circle' style={{ fontSize: '1.2rem', color: 'var(--primary)' }}></i>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>
                  You can add screenshots using either a <strong style={{ color: 'white' }}>URL</strong> or by <strong style={{ color: 'white' }}>uploading an image file</strong>
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {formData.screenshots.map((scr, index) => {
                  const method = screenshotMethods[index] || 'url';
                  
                  return (
                    <div key={index} className="screenshot-item-wrapper">
                      {/* Method Toggle */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => handleScreenshotMethodChange(index, 'url')}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: method === 'url' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                            background: method === 'url' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            color: method === 'url' ? 'var(--primary)' : 'var(--muted)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i className='bx bx-link'></i> URL
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScreenshotMethodChange(index, 'file')}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: method === 'file' ? '1px solid var(--secondary)' : '1px solid rgba(255,255,255,0.1)',
                            background: method === 'file' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            color: method === 'file' ? 'var(--secondary)' : 'var(--muted)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i className='bx bx-upload'></i> Upload File
                        </button>
                      </div>
                      
                      {/* Input Fields */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {method === 'url' ? (
                          <input 
                            type="text" 
                            className="admin-form-input" 
                            placeholder="https://example.com/image.jpg" 
                            value={scr.src || (typeof scr === 'string' ? scr : '')} 
                            onChange={(e) => updateArrayItem('screenshots', index, 'src', e.target.value)} 
                          />
                        ) : (
                          <div style={{ position: 'relative' }}>
                            <input 
                              type="file" 
                              accept="image/*"
                              ref={el => fileInputRefs.current[index] = el}
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleScreenshotFileUpload(index, e.target.files[0]);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[index]?.click()}
                              style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px dashed rgba(16, 185, 129, 0.4)',
                                background: 'rgba(16, 185, 129, 0.05)',
                                color: scr.src ? 'var(--secondary)' : 'var(--muted)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                              }}
                            >
                              <i className='bx bx-cloud-upload' style={{ fontSize: '1.2rem' }}></i>
                              {scr.src ? 'Change Image' : 'Choose Image'}
                            </button>
                            {scr.src && (
                              <div className="upload-success-msg">
                                <i className='bx bx-check-circle'></i>
                                Image uploaded successfully
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Preview - Shows right after upload */}
                        {scr.src && (
                          <div className="screenshot-preview-card">
                            <div className="screenshot-preview-header">
                              <span className="screenshot-preview-badge">
                                <i className='bx bx-images' style={{ color: 'var(--accent)' }}></i>
                                Preview
                              </span>
                              <span className="screenshot-preview-number">
                                Screenshot #{index + 1}
                              </span>
                            </div>
                            <img 
                              src={scr.src} 
                              alt={scr.label || 'Screenshot'} 
                              className="screenshot-preview-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="screenshot-error-placeholder" style={{ display: 'none' }}>
                              <i className='bx bx-error-circle'></i>
                              Failed to load image
                            </div>
                            {scr.label && (
                              <div className="screenshot-label-display">
                                <i className='bx bx-tag'></i> {scr.label}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginTop: '0.75rem' }}>
                          <input 
                            type="text" 
                            className="admin-form-input" 
                            placeholder="Label (optional)" 
                            value={scr.label || ''} 
                            onChange={(e) => updateArrayItem('screenshots', index, 'label', e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveScreenshot(index, scr.label)}
                            className="screenshot-remove-btn"
                            title="Remove this screenshot"
                          >
                            <i className='bx bx-x-circle'></i>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button type="button" onClick={() => addArrayItem('screenshots', { src: '', label: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  <i className='bx bx-image-add'></i> Add Screenshot
                </button>
              </div>
            </div>

            {/* Tech Specs Section */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className='bx bx-cog' style={{ color: 'rgb(200, 150, 255)' }}></i>
                  Technical Specifications
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.specs.map((spec, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 40px', gap: '0.5rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <input type="text" className="admin-form-input" placeholder="Label" value={spec.label || ''} onChange={(e) => updateArrayItem('specs', index, 'label', e.target.value)} />
                    <input type="text" className="admin-form-input" placeholder="Value" value={spec.value || ''} onChange={(e) => updateArrayItem('specs', index, 'value', e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('specs', index)} className="admin-action-btn delete" style={{ height: '36px' }}>
                      <i className='bx bx-x'></i>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('specs', { label: '', value: '' })} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  <i className='bx bx-plus'></i> Add Specification
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <button type="button" className="btn btn-outline" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>
                {app ? 'Update App' : 'Create App'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={cancelRemoveScreenshot}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>Remove Screenshot</h3>
            </div>
            <div className="custom-modal-body">
              <p>
                Are you sure you want to remove this screenshot
                {pendingRemoval?.label ? ` "${pendingRemoval.label}"` : ''}?
              </p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={cancelRemoveScreenshot}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmRemoveScreenshot}>
                <i className='bx bx-check'></i>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
