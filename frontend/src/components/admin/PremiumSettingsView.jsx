/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { newId } from '../../lib/adminCrud';
import ExportPdfButton from './ExportPdfButton';
import AdminModal from './AdminModal';
import { CrudActions, thStyle, tdStyle, trBorder } from './adminTableStyles';
import { exportPremiumPdf } from '../../lib/exportPdf';

const emptyPlan = () => ({
  id: newId('plan'),
  name: '',
  priceMonthly: '',
  priceYearly: '',
  features: [''],
});

async function savePremium(data) {
  const value = {
    monthly: data.monthly,
    yearly: data.yearly,
    discount: data.discount,
    plans: data.plans.map(({ id, name, priceMonthly, priceYearly, features }) => ({
      id,
      name: name.trim(),
      priceMonthly: Number(priceMonthly) || 0,
      priceYearly: Number(priceYearly) || 0,
      features: features.filter((f) => f.trim()),
    })),
    features: data.features.filter((f) => f.trim()),
  };
  await api.post('/site-data/premium_settings', { value });
  return value;
}

export default function PremiumSettingsView({ showToast }) {
  const [settings, setSettings] = useState({ monthly: '', yearly: '', discount: '', plans: [], features: [] });
  const [loading, setLoading] = useState(true);
  const [planModal, setPlanModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [planForm, setPlanForm] = useState(emptyPlan());
  const [featureText, setFeatureText] = useState('');
  const [editPlan, setEditPlan] = useState(false);
  const [editFeatureIdx, setEditFeatureIdx] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/site-data/premium_settings');
      const data = res.data || {};
      setSettings({
        monthly: data.monthly ?? '',
        yearly: data.yearly ?? '',
        discount: data.discount ?? '',
        plans: (data.plans || []).map((p, i) => ({
          ...p,
          id: p.id || newId(`plan-${i}`),
          features: p.features?.length ? p.features : [''],
        })),
        features: data.features || [],
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to load premium settings.', true);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (next) => {
    const saved = await savePremium(next);
    setSettings({
      monthly: saved.monthly,
      yearly: saved.yearly,
      discount: saved.discount,
      plans: saved.plans,
      features: saved.features,
    });
  };

  const saveGlobal = async (e) => {
    e.preventDefault();
    try {
      await persist(settings);
      showToast('Global pricing updated.');
    } catch (err) {
      showToast('Failed to save pricing.', true);
    }
  };

  const openPlanCreate = () => {
    setPlanForm(emptyPlan());
    setEditPlan(false);
    setPlanModal(true);
  };

  const openPlanEdit = (plan) => {
    setPlanForm({
      ...plan,
      features: plan.features?.length ? [...plan.features] : [''],
    });
    setEditPlan(true);
    setPlanModal(true);
  };

  const savePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showToast('Plan name is required.', true);
      return;
    }
    try {
      const cleaned = {
        ...planForm,
        features: planForm.features.filter((f) => f.trim()),
      };
      const next = {
        ...settings,
        plans: editPlan
          ? settings.plans.map((p) => (p.id === planForm.id ? cleaned : p))
          : [...settings.plans, cleaned],
      };
      await persist(next);
      showToast(editPlan ? 'Plan updated.' : 'Plan added.');
      setPlanModal(false);
    } catch (err) {
      showToast('Failed to save plan.', true);
    }
  };

  const deletePlan = (plan) => {
    setPendingDelete({ type: 'plan', data: plan });
    setShowConfirmModal(true);
  };

  const deleteFeature = (idx) => {
    setPendingDelete({ type: 'feature', data: { idx, text: settings.features[idx] } });
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      if (pendingDelete.type === 'plan') {
        await persist({ ...settings, plans: settings.plans.filter((p) => p.id !== pendingDelete.data.id) });
        showToast('Plan deleted');
      } else if (pendingDelete.type === 'feature') {
        await persist({ ...settings, features: settings.features.filter((_, i) => i !== pendingDelete.data.idx) });
        showToast('Feature deleted');
      }
      setShowConfirmModal(false);
      setPendingDelete(null);
    } catch (err) {
      showToast('Failed to delete', 'error');
      setShowConfirmModal(false);
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPendingDelete(null);
  };

  const openFeatureCreate = () => {
    setFeatureText('');
    setEditFeatureIdx(null);
    setFeatureModal(true);
  };

  const openFeatureEdit = (idx) => {
    setFeatureText(settings.features[idx]);
    setEditFeatureIdx(idx);
    setFeatureModal(true);
  };

  const saveFeature = async (e) => {
    e.preventDefault();
    if (!featureText.trim()) {
      showToast('Feature text is required.', true);
      return;
    }
    try {
      const features = [...settings.features];
      if (editFeatureIdx !== null) {
        features[editFeatureIdx] = featureText.trim();
      } else {
        features.push(featureText.trim());
      }
      await persist({ ...settings, features });
      showToast(editFeatureIdx !== null ? 'Feature updated.' : 'Feature added.');
      setFeatureModal(false);
    } catch (err) {
      showToast('Failed to save feature.', true);
    }
  };

  if (loading) {
    return <div className="route-loader"><div className="spinner" /></div>;
  }

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Premium Pricing <span className="text-primary-gradient">Plans</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Configure subscription tiers and pricing structure</p>
        </div>
        <div className="admin-view-actions">
          <ExportPdfButton
            label="📊 Export"
            onClick={() => {
              exportPremiumPdf(settings);
              showToast('Premium PDF downloaded.');
            }}
          />
        </div>
      </div>

      {/* Global Billing Defaults */}
      <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-cog' style={{ color: 'var(--primary)' }}></i>
            Global Billing Defaults
          </h3>
        </div>
        <div className="admin-card-body">
          <form onSubmit={saveGlobal} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Monthly Price ($)</label>
              <input type="number" className="admin-form-input" value={settings.monthly} onChange={(e) => setSettings({ ...settings, monthly: e.target.value })} placeholder="19" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Yearly Price ($)</label>
              <input type="number" className="admin-form-input" value={settings.yearly} onChange={(e) => setSettings({ ...settings, yearly: e.target.value })} placeholder="189" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Discount (%)</label>
              <input type="number" className="admin-form-input" value={settings.discount} onChange={(e) => setSettings({ ...settings, discount: e.target.value })} placeholder="17" min="0" max="100" />
              <div className="admin-form-hint">Applied to yearly plans</div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: 'fit-content' }}>
              <i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>
              Save Defaults
            </button>
          </form>
        </div>
      </div>

      {/* Pricing Plans Table */}
      <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-list-ul' style={{ color: 'var(--secondary)' }}></i>
            Pricing Plans
          </h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={openPlanCreate}>
            <i className='bx bx-plus'></i> Add Plan
          </button>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {settings.plans.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                    <th>Features</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.plans.map((plan) => (
                    <tr key={plan.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{plan.name}</strong></td>
                      <td><span style={{ fontSize: '0.95rem', fontWeight: 600 }}>${plan.priceMonthly}</span></td>
                      <td><span style={{ fontSize: '0.95rem', fontWeight: 600 }}>${plan.priceYearly}</span></td>
                      <td><span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{plan.features?.length || 0} items</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="admin-action-btn edit" onClick={() => openPlanEdit(plan)} title="Edit">
                            <i className='bx bx-pencil'></i>
                          </button>
                          <button type="button" className="admin-action-btn delete" onClick={() => deletePlan(plan)} title="Delete">
                            <i className='bx bx-trash'></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
              <i className='bx bx-inbox' style={{ fontSize: '2rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}></i>
              No pricing plans yet. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Premium Features */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className='bx bx-star' style={{ color: 'var(--accent)' }}></i>
            Premium Highlights
          </h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={openFeatureCreate}>
            <i className='bx bx-plus'></i> Add Feature
          </button>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {settings.features.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.features.map((feat, idx) => (
                    <tr key={idx}>
                      <td>{feat}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="admin-action-btn edit" onClick={() => openFeatureEdit(idx)} title="Edit">
                            <i className='bx bx-pencil'></i>
                          </button>
                          <button type="button" className="admin-action-btn delete" onClick={() => deleteFeature(idx)} title="Delete">
                            <i className='bx bx-trash'></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
              <i className='bx bx-inbox' style={{ fontSize: '2rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}></i>
              No premium features yet. Add features that highlight your subscription value.
            </div>
          )}
        </div>
      </div>

      {/* Plan Form Modal */}
      <AdminModal
        open={planModal}
        title={editPlan ? 'Edit Pricing Plan' : 'Add New Plan'}
        onClose={() => setPlanModal(false)}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setPlanModal(false)}>Cancel</button>
            <button type="submit" form="plan-form" className="btn btn-primary"><i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>{editPlan ? 'Update Plan' : 'Create Plan'}</button>
          </>
        }
      >
        <form id="plan-form" onSubmit={savePlan} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Plan Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" className="admin-form-input" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g. Starter, Growth, Scale" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Monthly Price ($)</label>
              <input type="number" className="admin-form-input" value={planForm.priceMonthly} onChange={(e) => setPlanForm({ ...planForm, priceMonthly: e.target.value })} placeholder="19" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Yearly Price ($)</label>
              <input type="number" className="admin-form-input" value={planForm.priceYearly} onChange={(e) => setPlanForm({ ...planForm, priceYearly: e.target.value })} placeholder="189" />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Plan Features</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {planForm.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ flex: 1 }}
                    value={feat}
                    onChange={(e) => {
                      const features = [...planForm.features];
                      features[i] = e.target.value;
                      setPlanForm({ ...planForm, features });
                    }}
                    placeholder="Feature description"
                  />
                  <button
                    type="button"
                    className="admin-action-btn delete"
                    onClick={() => setPlanForm({ ...planForm, features: planForm.features.filter((_, j) => j !== i) })}
                  >
                    <i className='bx bx-x'></i>
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPlanForm({ ...planForm, features: [...planForm.features, ''] })} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              <i className='bx bx-plus'></i> Add Line
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Feature Form Modal */}
      <AdminModal
        open={featureModal}
        title={editFeatureIdx !== null ? 'Edit Premium Feature' : 'Add Premium Feature'}
        onClose={() => setFeatureModal(false)}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setFeatureModal(false)}>Cancel</button>
            <button type="submit" form="feature-form" className="btn btn-primary"><i className='bx bx-save' style={{ marginRight: '0.5rem' }}></i>Save Feature</button>
          </>
        }
      >
        <form id="feature-form" onSubmit={saveFeature}>
          <div className="admin-form-group">
            <label className="admin-form-label">Feature Description</label>
            <input type="text" className="admin-form-input" value={featureText} onChange={(e) => setFeatureText(e.target.value)} placeholder="e.g. Dedicated strategists" required />
            <div className="admin-form-hint">This will appear in the premium highlights section</div>
          </div>
        </form>
      </AdminModal>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={cancelDelete}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>{pendingDelete?.type === 'plan' ? 'Delete Plan' : 'Delete Feature'}</h3>
            </div>
            <div className="custom-modal-body">
              <p>
                {pendingDelete?.type === 'plan' 
                  ? `Are you sure you want to delete the plan "${pendingDelete.data.name}"?`
                  : 'Are you sure you want to delete this premium feature?'}
              </p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDelete}>
                <i className='bx bx-check'></i>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
