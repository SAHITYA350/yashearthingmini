// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Auth Screen
import AuthView from './features/auth/AuthView';

// Unified Operational Views (Serial Workflow)
import MasterDashboardView from './features/dashboard/MasterDashboardView';
import SalesView from './features/module1/SalesView';
import SupplyView from './features/module2/SupplyView';
import EngineeringView from './features/module3/EngineeringView';
import ProductionView from './features/module4/ProductionView';
import SiteView from './features/module5/SiteView';
import FinanceView from './features/module6/FinanceView';
import WorkforceView from './features/module7/WorkforceView';

// Quick Modals
import { QuickAddModal, TraceJobModal, MediaLibraryModal } from './components/modals/QuickModals';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token') || localStorage.getItem('user'));
  });

  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Verify auth token on initial mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data?.user) {
            setCurrentUser(res.data.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // If offline or dev mode without token verification, keep local user state
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast('You have logged out successfully.');
  };

  // If not logged in, render the Login & Signup screen with Unsplash hero
  if (!isAuthenticated) {
    return (
      <div className="auth-root">
        <AuthView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            toast(`Logged in as ${user.name} (${user.role || 'Enterprise User'})`);
          }}
        />
        {toastMsg && <div className="toast">{toastMsg}</div>}
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        counts={{
          sales: '21 Leads',
          vendors: '3 Vendors',
          engineering: '64 SKUs',
          projects: '2 Sites',
          tasks: '24 Tasks',
        }}
      />

      <main className="main">
        <TopBar
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentUser={currentUser}
          onOpenTrace={() => setModalType('TRACE_JOB')}
          onOpenMedia={() => setModalType('MEDIA_LIBRARY')}
          onOpenTaskModal={() => setActiveTab('tasks')}
          onOpenPerformance={() => setActiveTab('tasks')}
          onOpenAddModal={() => setModalType('QUICK_ADD')}
          onLogout={handleLogout}
        />

        <div className="content">
          {/* CONTROL TOWER */}
          {activeTab === 'dashboard' && (
            <MasterDashboardView
              setActiveTab={setActiveTab}
              onOpenQuickAdd={() => setModalType('QUICK_ADD')}
              onOpenTrace={() => setModalType('TRACE_JOB')}
            />
          )}

          {/* MODULE 1: SALES, CRM & ORDER */}
          {activeTab === 'sales' && <SalesView />}

          {/* MODULE 2: VENDOR, PROCUREMENT & INVENTORY */}
          {activeTab === 'supply' && <SupplyView toast={toast} />}

          {/* MODULE 3: PRODUCT & ENGINEERING */}
          {activeTab === 'engineering' && <EngineeringView />}

          {/* MODULE 4: PRODUCTION & QUALITY */}
          {activeTab === 'production' && <ProductionView toast={toast} />}

          {/* MODULE 5: PROJECT, INSTALLATION & SERVICE */}
          {activeTab === 'site' && <SiteView toast={toast} />}

          {/* MODULE 6: FINANCE & COMMERCIAL */}
          {activeTab === 'finance' && <FinanceView />}

          {/* MODULE 7: WORKFORCE, ADMIN & MIS */}
          {activeTab === 'tasks' && <WorkforceView toast={toast} />}
        </div>
      </main>

      {/* GLOBAL MODALS */}
      <QuickAddModal
        isOpen={modalType === 'QUICK_ADD'}
        onClose={() => setModalType(null)}
        toast={toast}
      />

      <TraceJobModal
        isOpen={modalType === 'TRACE_JOB'}
        onClose={() => setModalType(null)}
      />

      <MediaLibraryModal
        isOpen={modalType === 'MEDIA_LIBRARY'}
        onClose={() => setModalType(null)}
      />

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
