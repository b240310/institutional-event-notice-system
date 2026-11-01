import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  Bell,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  User,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const Notices = () => {
  const { user, isAdmin, isFaculty } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const canPost = isAdmin || isFaculty;

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
        search: search.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        priority: priority !== 'all' ? priority : undefined
      };

      const res = await api.get('/notices', { params });
      if (res.data.success) {
        setNotices(res.data.notices);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page, category, priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotices();
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const res = await api.delete(`/notices/${noticeId}`);
      if (res.data.success) {
        toast.success('Notice deleted successfully');
        fetchNotices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notice');
    }
  };

  const canModifyNotice = (notice) => {
    if (isAdmin) return true;
    if (isFaculty && notice.postedBy?._id === user?.id) return true;
    return false;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Notice Board
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Official announcements, departmental circulars, and updates ({totalCount} total)
          </p>
        </div>

        {canPost && (
          <Link to="/notices/create" className="btn btn-primary">
            <PlusCircle size={18} /> Post New Notice
          </Link>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <Card style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="administrative">Administrative</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn btn-secondary">
            Apply Filters
          </button>
        </form>
      </Card>

      {/* Notices Grid */}
      {loading ? (
        <Loader message="Loading notice board..." />
      ) : notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description="Try broadening your search criteria or checking another category."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {notices.map((notice) => (
            <Card
              key={notice._id}
              hover
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft:
                  notice.priority === 'high'
                    ? '4px solid var(--danger)'
                    : notice.priority === 'medium'
                    ? '4px solid var(--warning)'
                    : '4px solid #94a3b8'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}
                >
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
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  <Link to={`/notices/${notice._id}`} style={{ color: 'var(--text-main)' }}>
                    {notice.title}
                  </Link>
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                    marginBottom: '1rem'
                  }}
                >
                  {notice.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.775rem',
                    color: '#64748b',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}
                >
                  <span>
                    Posted by: <strong>{notice.postedBy?.name || 'Department'}</strong>
                  </span>
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/notices/${notice._id}`} className="btn btn-secondary btn-sm">
                    Read More <ArrowRight size={14} />
                  </Link>

                  {canModifyNotice(notice) && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link
                        to={`/notices/edit/${notice._id}`}
                        className="btn btn-secondary btn-sm"
                        title="Edit Notice"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.85rem', fontSize: '0.875rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notices;

