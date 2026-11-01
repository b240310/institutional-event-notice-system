import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, Lock, Mail, User, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
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
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      toast.success('Registration successful! Welcome to CampusConnect.');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
        padding: '2rem 1.5rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--surface)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
            }}
          >
            <GraduationCap size={30} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Create an Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Register as a student or faculty member
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="jane@student.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (min. 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department / School</label>
            <div style={{ position: 'relative' }}>
              <select
                name="department"
                className="form-select"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <Building
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  border: `2px solid ${
                    formData.role === 'student' ? 'var(--primary)' : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius)',
                  background: formData.role === 'student' ? 'var(--primary-light)' : 'var(--surface)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Student
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  border: `2px solid ${
                    formData.role === 'faculty' ? 'var(--primary)' : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius)',
                  background: formData.role === 'faculty' ? 'var(--primary-light)' : 'var(--surface)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="faculty"
                  checked={formData.role === 'faculty'}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Faculty
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

