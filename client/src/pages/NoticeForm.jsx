import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { ArrowLeft, Save, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

const NoticeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchNotice = async () => {
        try {
          const res = await api.get(`/notices/${id}`);
          if (res.data.success) {
            const n = res.data.notice;
            setFormData({
              title: n.title,
              description: n.description,
              category: n.category,
              priority: n.priority,
              expiryDate: n.expiryDate ? n.expiryDate.split('T')[0] : ''
            });
          }
        } catch (error) {
          toast.error('Failed to load notice for editing');
          navigate('/notices');
        } finally {
          setFetchLoading(false);
        }
      };

      fetchNotice();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please provide a title and notice description');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/notices/${id}`, formData);
        toast.success('Notice updated successfully');
        navigate(`/notices/${id}`);
      } else {
        await api.post('/notices', formData);
        toast.success('Notice published successfully');
        navigate('/notices');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Loader fullScreen message="Loading notice information..." />;
  }

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/notices" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Notices
        </Link>
      </div>

      <Card style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bell size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {isEdit ? 'Edit Notice' : 'Post New Notice'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {isEdit ? 'Update details of your announcement' : 'Publish an official notice to campus members'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Notice Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. End-Term Examination Schedule - Fall Semester"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level *</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                className="form-input"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notice Body / Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={8}
              placeholder="Write the full announcement text, guidelines, or instructions here..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/notices" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Saving...' : isEdit ? 'Update Notice' : 'Publish Notice'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NoticeForm;

