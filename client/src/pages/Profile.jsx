import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { User, Mail, Building, Shield, Lock, Save, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const departments = [
    'Central Administration',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Management Studies',
    'Applied Sciences'
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.department.trim()) {
      toast.error('Name and Department cannot be empty');
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New password and confirmation do not match');
        return;
      }
      if (!formData.currentPassword) {
        toast.error('Please enter your current password to set a new password');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        department: formData.department,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      };

      const res = await api.put('/users/profile', payload);
      if (res.data.success) {
        updateUserData(res.data.user);
        toast.success('Profile updated successfully');
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          User Profile & Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Manage your personal details and account credentials
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                {user?.name}
              </h2>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {user?.email} • {user?.department}
            </p>
          </div>
        </div>
      </Card>

      {/* Form Card */}
      <Card style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Edit Account Information
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Institutional email is verified and cannot be changed.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Department / School</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={{ margin: '2rem 0 1.25rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Change Password
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Leave these fields blank if you do not wish to update your password.
            </p>

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-type new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

