import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { BookmarkCheck, Calendar, Clock, MapPin, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const MyRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my-registrations');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (error) {
      toast.error('Failed to load your event registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your event registration?')) {
      return;
    }

    try {
      const res = await api.post(`/events/${eventId}/unregister`);
      if (res.data.success) {
        toast.info('Registration cancelled');
        fetchMyRegistrations();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading your registered events..." />;
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          My Event Registrations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Events you have signed up for across campus ({events.length} total)
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No registered events"
          description="You haven't signed up for any campus events yet. Explore upcoming workshops and hackathons."
          action={
            <Link to="/events" className="btn btn-primary">
              <Calendar size={18} /> Browse Events
            </Link>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {events.map((event) => (
            <Card
              key={event._id}
              hover
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-success">
                    <BookmarkCheck size={12} /> Registered
                  </span>
                  <span className={`badge badge-${event.status === 'upcoming' ? 'primary' : 'secondary'}`}>
                    {event.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  <Link to={`/events/${event._id}`} style={{ color: 'var(--text-main)' }}>
                    {event.title}
                  </Link>
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    lineHeight: 1.5
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    fontSize: '0.825rem',
                    color: '#475569',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{event.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                  Details <ArrowRight size={14} />
                </Link>

                {event.status === 'upcoming' && (
                  <button
                    onClick={() => handleUnregister(event._id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;

