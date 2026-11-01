import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  Users,
  Bell,
  Calendar,
  BookmarkCheck,
  TrendingUp,
  BarChart2,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading dashboard statistics..." />;
  }

  const totals = stats?.totals || { users: 0, notices: 0, events: 0, registrations: 0 };
  const upcomingEvents = stats?.upcomingEvents || [];
  const recentNotices = stats?.recentNotices || [];
  const eventsPerMonth = stats?.eventsPerMonth || [];
  const registrationsPerEvent = stats?.registrationsPerEvent || [];
  const noticesByCategory = stats?.noticesByCategory || [];

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div>
          <span
            className="badge badge-primary"
            style={{ marginBottom: '0.75rem', display: 'inline-block' }}
          >
            {user?.role.toUpperCase()} PORTAL
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Department of {user?.department} • Here is what's happening across campus today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(isAdmin || isFaculty) && (
            <>
              <Link to="/notices/create" className="btn btn-primary btn-sm">
                <Plus size={16} /> Post Notice
              </Link>
              <Link to="/events/create" className="btn btn-secondary btn-sm">
                <Plus size={16} /> Create Event
              </Link>
            </>
          )}
          {isStudent && (
            <Link to="/events" className="btn btn-primary btn-sm">
              <Calendar size={16} /> Browse Upcoming Events
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <Card hover>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                TOTAL NOTICES
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {totals.notices}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={22} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                CAMPUS EVENTS
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {totals.events}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar size={22} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                EVENT REGISTRATIONS
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {totals.registrations}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#faf5ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookmarkCheck size={22} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isStudent ? 'MY REGISTRATIONS' : 'CAMPUS MEMBERS'}
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {isStudent ? (stats?.studentStats?.registeredCount || 0) : totals.users}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isStudent ? <BookmarkCheck size={22} /> : <Users size={22} />}
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics & Aggregation Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Events Per Month Chart (Bar representation) */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" />
              Events Scheduled by Month
            </h3>
          </div>
          {eventsPerMonth.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No monthly event distribution recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {eventsPerMonth.map((item, idx) => {
                const max = Math.max(...eventsPerMonth.map((m) => m.count), 1);
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{item.count} {item.count === 1 ? 'event' : 'events'}</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Registrations Per Event Aggregation */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} color="#059669" />
              Registrations by Event
            </h3>
          </div>
          {registrationsPerEvent.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No registrations recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {registrationsPerEvent.map((ev) => {
                const percent = Math.min(100, Math.round((ev.registrationsCount / ev.capacity) * 100));
                return (
                  <div key={ev._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%' }}>
                        {ev.title}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {ev.registrationsCount} / {ev.capacity} ({percent}%)
                      </span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: percent >= 90 ? '#ef4444' : percent >= 60 ? '#f59e0b' : '#10b981',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Grid: Upcoming Events & Recent Notices */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Upcoming Events */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Upcoming Events</h3>
            <Link to="/events" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <EmptyState title="No upcoming events" description="Check back soon for upcoming campus gatherings." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Link
                      to={`/events/${event._id}`}
                      style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}
                    >
                      {event.title}
                    </Link>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        marginTop: '0.3rem',
                        fontSize: '0.775rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>🕒 {event.time}</span>
                      <span>📍 {event.venue}</span>
                    </div>
                  </div>
                  <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Notices */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Notices</h3>
            <Link to="/notices" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentNotices.length === 0 ? (
            <EmptyState title="No notices posted" description="All recent notices will be displayed here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentNotices.map((notice) => (
                <div
                  key={notice._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: '#f8fafc',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
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
                      {notice.priority}
                    </span>
                  </div>
                  <Link
                    to={`/notices/${notice._id}`}
                    style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}
                  >
                    {notice.title}
                  </Link>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

