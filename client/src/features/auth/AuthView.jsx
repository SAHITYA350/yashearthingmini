import React, { useState } from 'react';

const QUICK_ROLES = [
  { label: 'Super Admin', email: 'admin@yash.test', role: 'ADMIN', badge: 'Full Access', icon: '👑' },
  { label: 'Sales Manager', email: 'priya.mehta@yashgroup.in', role: 'SALES_MANAGER', badge: 'Module 1', icon: '💼' },
  { label: 'Chief Engineer', email: 'engineer@yashgroup.com', role: 'ENGINEER', badge: 'Module 3', icon: '⚙️' },
  { label: 'Procurement Lead', email: 'procurement@yashgroup.com', role: 'PROCUREMENT_OFFICER', badge: 'Module 5', icon: '🏢' },
  { label: 'Project Operations', email: 'operations@yashgroup.com', role: 'PROJECT_MANAGER', badge: 'Module 2', icon: '🏗️' },
  { label: 'Finance Head', email: 'finance@yash.test', role: 'FINANCE_MANAGER', badge: 'Module 6', icon: '💰' },
  { label: 'Senior Accountant', email: 'accountant@yash.test', role: 'BANK_OFFICE_EXECUTIVE', badge: 'Banking', icon: '📊' },
  { label: 'Audit Viewer', email: 'viewer@yash.test', role: 'BACK_OFFICER', badge: 'Read-only', icon: '👁️' },
];

export default function AuthView({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('admin@yash.test');
  const [password, setPassword] = useState('Yash@Test123');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Administration');
  const [role, setRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleQuickLogin = (roleItem) => {
    setEmail(roleItem.email);
    setPassword('Yash@Test123');
    performLogin(roleItem.email, 'Yash@Test123');
  };

  const performLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid login credentials');
      }
      if (data.data?.token) {
        localStorage.setItem('yash_auth_token', data.data.token);
      }
      if (data.data?.user) {
        localStorage.setItem('yash_user', JSON.stringify(data.data.user));
      }
      onLoginSuccess(data.data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      performLogin(email, password);
    } else {
      // Signup
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, department, role }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Signup failed');
        }
        setSuccessMsg('Account created successfully! You can now sign in.');
        setMode('login');
      } catch (err) {
        setError(err.message || 'Could not complete registration.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Left Column: Visual Showcase with User-Requested Unsplash Hero Image */}
      <div
        className="auth-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(4, 44, 34, 0.85), rgba(6, 78, 59, 0.92)), url('https://images.unsplash.com/photo-1711571603482-12a23d3d1e43?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')`,
        }}
      >
        <div className="auth-hero-content">
          <div className="hero-logo-row">
            <div className="hero-icon">Y</div>
            <div>
              <h2>YASH GROUP ERP</h2>
              <p>Version 3 · Complete Enterprise Control</p>
            </div>
          </div>

          <div className="hero-quote-box">
            <span className="badge-pill">Green · White Operational System</span>
            <h3>Lead → Supply → Engineering → Production → Site → Accounts → People</h3>
            <p>
              Integrated enterprise platform connecting technical drawing specifications,
              BOM costing simulations, factory work orders, field site execution, and commercial finance.
            </p>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <b>100%</b>
              <small>End-to-End Traceability</small>
            </div>
            <div className="hero-stat">
              <b>7 Modules</b>
              <small>Unified Operations</small>
            </div>
            <div className="hero-stat">
              <b>ISO / IEEE</b>
              <small>Compliance Standard</small>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Login & Signup Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-header">
            <div className="auth-logo-badge">YG</div>
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create ERP Account'}</h2>
            <p className="auth-sub">
              {mode === 'login'
                ? 'Sign in to access your operational role workspace'
                : 'Register a new enterprise user credential'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="auth-toggle">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {successMsg && <div className="auth-alert success">{successMsg}</div>}

          {/* Quick 1-Click Role Login Selector (Crucial for Reviewers & Stakeholders) */}
          {mode === 'login' && (
            <div className="quick-roles-section">
              <div className="quick-roles-title">
                <span>⚡ Quick Demo Role Login</span>
                <small>Click to log in directly as any role:</small>
              </div>
              <div className="quick-roles-grid">
                {QUICK_ROLES.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    className="role-pill-btn"
                    onClick={() => handleQuickLogin(r)}
                    title={`Log in as ${r.label}`}
                  >
                    <span className="role-ico">{r.icon}</span>
                    <div className="role-meta">
                      <b>{r.label}</b>
                      <small>{r.badge}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login / Signup Form */}
          <form onSubmit={handleFormSubmit} className="auth-form">
            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Administration">Administration</option>
                      <option value="Sales">Sales & CRM</option>
                      <option value="Engineering">Product Engineering</option>
                      <option value="Purchase">Purchase & Procurement</option>
                      <option value="Projects">Site Projects</option>
                      <option value="Finance">Commercial Finance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="ADMIN">Administrator</option>
                      <option value="SALES_MANAGER">Sales Manager</option>
                      <option value="SALES_CONSULTANT">Sales Consultant</option>
                      <option value="ENGINEER">Chief Engineer</option>
                      <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                      <option value="PROJECT_MANAGER">Project Manager</option>
                      <option value="FINANCE_MANAGER">Finance Manager</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@yashgroup.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                {mode === 'login' && <small className="default-hint">Default: Yash@Test123</small>}
              </div>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="submit-auth-btn"
              disabled={loading}
            >
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Yash ERP'
                : 'Complete Registration'}
            </button>
          </form>

          <div className="auth-footer-note">
            <span>🔒 Enterprise 256-bit AES & RBAC Protected</span>
            <small>© 2026 Yash Group of Companies · All Rights Reserved</small>
          </div>
        </div>
      </div>
    </div>
  );
}
