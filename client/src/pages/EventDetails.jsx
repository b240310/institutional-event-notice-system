import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import DataTable from '../components/DataTable';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Building,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isFaculty } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
      }
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      setActionLoading(true);
      const res = await api.post(`/events/${id}/register`);
      if (res.data.success) {
        toast.success('Successfully registered for this event!');
        fetchEvent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.post(`/events/${id}/unregister`);
      if (res.data.success) {
        toast.info('Registration cancelled');
        fetchEvent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        toast.success('Event deleted');
        navigate('/events');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const isRegistered = event.registeredUsers?.some(
    (u) => (u._id || u) === (user?.id || user?._id)
  );
  const regCount = event.registeredUsers?.length || 0;
  const isFull = regCount >= event.capacity;
  const percentFilled = Math.min(100, Math.round((regCount / event.capacity) * 100));
  const canModify = isAdmin || (isFaculty && event.organizer?._id === user?.id);
  const canViewAttendees = isAdmin || (isFaculty && event.organizer?._id === user?.id);

  const attendeeColumns = [
    {
      header: 'Attendee Name',
      accessor: 'name',
      render: (row) => <strong>{row.name}</strong>
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Department',
      accessor: 'department'
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
          {row.role}
        </span>
      )
    }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Top back bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <Link to="/events" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {canModify && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/events/edit/${event._id}`} className="btn btn-secondary btn-sm">
              <Edit size={16} /> Edit Event
            </Link>
            <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Main Details */}
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
            <span
              className={`badge ${
                event.status === 'upcoming'
                  ? 'badge-primary'
                  : event.status === 'ongoing'
                  ? 'badge-warning'
                  : event.status === 'completed'
                  ? 'badge-success'
                  : 'badge-danger'
              }`}
            >
              {event.status}
            </span>

            {isRegistered && (
              <span className="badge badge-success">
                <CheckCircle size={12} /> You are registered
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.25rem' }}>
            {event.title}
          </h1>

          <div
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: '#334155',
              whiteSpace: 'pre-line',
              marginBottom: '1.5rem'
            }}
          >
            {event.description}
          </div>

          {/* Organizer details box */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e0e7ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Organized By
              </span>
              <p style={{ fontWeight: 700, margin: 0, fontSize: '0.925rem' }}>
                {event.organizer?.name}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {event.organizer?.department} ({event.organizer?.email})
              </span>
            </div>
          </div>
        </Card>

        {/* Event Schedule & Registration Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Schedule & Location
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event Date</div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time</div>
                  <strong style={{ fontSize: '0.95rem' }}>{event.time}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Venue</div>
                  <strong style={{ fontSize: '0.95rem' }}>{event.venue}</strong>
                </div>
              </div>
            </div>

            {/* Capacity tracker */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Seats Filled</span>
                <span>{regCount} / {event.capacity} ({percentFilled}%)</span>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentFilled}%`,
                    background: isFull ? 'var(--danger)' : 'var(--primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', margin: 0 }}>
                {event.capacity - regCount > 0 ? `${event.capacity - regCount} seats remaining` : 'No spots remaining'}
              </p>
            </div>

            {/* Action buttons */}
            {event.status === 'upcoming' ? (
              isRegistered ? (
                <button
                  onClick={handleUnregister}
                  disabled={actionLoading}
                  className="btn btn-outline-danger"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <XCircle size={18} />
                  <span>{actionLoading ? 'Processing...' : 'Cancel Registration'}</span>
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isFull || actionLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <CheckCircle size={18} />
                  <span>{actionLoading ? 'Processing...' : isFull ? 'Event is Full' : 'Register for Event'}</span>
                </button>
              )
            ) : (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Registrations are closed for this event ({event.status}).
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Organizer / Admin Attendee Roster Table */}
      {canViewAttendees && (
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" />
              Registered Attendees ({regCount})
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Visible only to event organizer & administration
            </span>
          </div>

          <DataTable
            columns={attendeeColumns}
            data={event.registeredUsers || []}
            emptyMessage="No students have registered for this event yet."
          />
        </Card>
      )}
    </div>
  );
};

export default EventDetails;

