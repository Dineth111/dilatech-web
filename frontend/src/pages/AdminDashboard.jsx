import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

import Sidebar from '../components/admin/Sidebar';
import DashboardView from '../components/admin/DashboardView';
import AppsListView from '../components/admin/AppsListView';
import AppFormView from '../components/admin/AppFormView';
import PremiumSettingsView from '../components/admin/PremiumSettingsView';
import SiteSettingsView from '../components/admin/SiteSettingsView';
import ManageReviewsView from '../components/admin/ManageReviewsView';
import ContactMessagesView from '../components/admin/ContactMessagesView';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // App form editing state
  const [editingApp, setEditingApp] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, msg: '', isErr: false, type: 'success' });
  
  // Custom confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (!res.data.isAdmin) {
        navigate('/admin/login');
      } else {
        setUser(res.data);
        fetchApps();
      }
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchApps = async () => {
    try {
      const res = await api.get('/apps');
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading apps:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const showToast = (msg, type = 'success') => {
    const isErr = type === 'error';
    setToast({ show: true, msg, isErr, type });
    setTimeout(() => setToast({ show: false, msg: '', isErr: false, type: 'success' }), 3000);
  };

  const handleEditApp = (appId) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      setEditingApp(app);
      setActiveTab('app-form');
    }
  };

  const handleDeleteApp = (app) => {
    setPendingAction({
      type: 'delete-app',
      data: app,
      title: 'Delete App',
      message: `Are you sure you want to delete "${app.name}"?`,
      warning: 'This action cannot be undone and all app data will be permanently removed.'
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === 'delete-app') {
        await api.delete(`/apps/${pendingAction.data.id}`);
        showToast(`"${pendingAction.data.name}" deleted`, 'error');
        fetchApps();
      }
      setShowConfirmModal(false);
      setPendingAction(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to complete action.', 'error');
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleSaveApp = async (appData) => {
    try {
      if (editingApp) {
        await api.put(`/apps/${appData.id}`, appData);
      } else {
        await api.post('/apps', appData);
      }
      showToast(`"${appData.name}" saved successfully`);
      setEditingApp(null);
      fetchApps();
      setActiveTab('apps-list');
    } catch (err) {
      console.error(err);
      showToast('Failed to save app.', true);
    }
  };

  // Watch for clicking "Add New App" to clear editing state
  useEffect(() => {
    if (activeTab === 'app-form' && !editingApp) {
      setEditingApp(null);
    }
    if (activeTab !== 'app-form') {
      setEditingApp(null);
    }
  }, [activeTab]);

  if (loading) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Mobile Menu Toggle */}
      <button 
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <i className={`bx ${sidebarOpen ? 'bx-x' : 'bx-menu'}`}></i>
      </button>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} 
        onLogout={handleLogout} 
        user={user}
      />

      <main className="admin-main admin-main-offset">
        {activeTab === 'dashboard' && <DashboardView apps={apps} setActiveTab={setActiveTab} showToast={showToast} />}
        {activeTab === 'apps-list' && <AppsListView apps={apps} setActiveTab={setActiveTab} onEdit={handleEditApp} onDelete={handleDeleteApp} showToast={showToast} />}
        {activeTab === 'app-form' && <AppFormView app={editingApp} onSave={handleSaveApp} onCancel={() => setActiveTab('apps-list')} showToast={showToast} />}
        {activeTab === 'premium-settings' && <PremiumSettingsView showToast={showToast} />}
        {activeTab === 'site-settings' && <SiteSettingsView showToast={showToast} />}
        {activeTab === 'manage-reviews' && <ManageReviewsView showToast={showToast} />}
        {activeTab === 'contact-messages' && <ContactMessagesView showToast={showToast} />}
      </main>

      {/* Toast Notification */}
      <div className={`admin-toast ${toast.show ? 'show' : ''} ${toast.type || 'success'}`}>
        <i className={`bx ${toast.type === 'error' ? 'bx-error-circle' : toast.type === 'info' ? 'bx-info-circle' : 'bx-check-circle'}`}></i>
        <span>{toast.msg}</span>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay" onClick={handleCancelAction}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <div className="modal-icon">
                <i className='bx bx-trash'></i>
              </div>
              <h3>{pendingAction?.title || 'Confirm Action'}</h3>
            </div>
            <div className="custom-modal-body">
              <p>{pendingAction?.message}</p>
              {pendingAction?.warning && (
                <p className="modal-warning">{pendingAction.warning}</p>
              )}
            </div>
            <div className="custom-modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={handleCancelAction}>
                <i className='bx bx-x'></i>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={handleConfirmAction}>
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
