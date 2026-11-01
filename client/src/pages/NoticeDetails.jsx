import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  ArrowLeft,
  Calendar,
  User,
  Building,
  Clock,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isFaculty } = useAuth();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/notices/${id}`);
        if (res.data.success) {
          setNotice(res.data.notice);
        }
      } catch (error) {
        toast.error('Failed to load notice details');
        navigate('/notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const res = await api.delete(`/notices/${id}`);
      if (res.data.success) {
        toast.success('Notice deleted');
        navigate('/notices');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notice');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading announcement..." />;
  }

  if (!notice) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Notice Not Found</h2>
        <Link to="/notices" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Notice Board
        </Link>
      </div>
    );
  }

  const canModify = isAdmin || (isFaculty && notice.postedBy?._id === user?.id);

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Top back button & action buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <Link to="/notices" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Notices
        </Link>

        {canModify && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/notices/edit/${notice._id}`} className="btn btn-secondary btn-sm">
              <Edit size={16} /> Edit Notice
            </Link>
            <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <Card style={{ padding: '2.5rem' }}>
        {/* Meta badges */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span className={`badge badge-${notice.category}`}>
            {notice.category}
          </span>
          <span
            className={`badge ${
              notice.priority === 'high'
                ? 'badge-danger'
                : notice.priority === 'medium'
                ? 'badge-warning'
                : 'badge-secondary'
            }`}
          >
            {notice.priority} priority
          </span>
          {notice.expiryDate && (
            <span className="badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={12} /> Expires: {new Date(notice.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          {notice.title}
        </h1>

        {/* Notice Info Box */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} color="var(--primary)" />
            <span>
              Posted by: <strong style={{ color: 'var(--text-main)' }}>{notice.postedBy?.name}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={16} color="var(--primary)" />
            <span>{notice.postedBy?.department}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="var(--primary)" />
            <span>Published on {new Date(notice.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Main Content Body */}
        <div
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: '#334155',
            whiteSpace: 'pre-line'
          }}
        >
          {notice.description}
        </div>
      </Card>
    </div>
  );
};

export default NoticeDetails;

