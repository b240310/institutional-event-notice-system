import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Search,
  PlusCircle,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

const Events = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [timeline, setTimeline] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const canCreate = isAdmin || isFaculty;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 6,
        search: search.trim() || undefined,
        status: status !== 'all' ? status : undefined,
        timeline: timeline !== 'all' ? timeline : undefined
      };

      const res = await api.get('/events', { params });
      if (res.data.success) {
        setEvents(res.data.events);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, status, timeline]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      if (res.data.success) {
        toast.success('Successfully registered for event!');
        fetchEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    try {
      const res = await api.post(`/events/${eventId}/unregister`);
      if (res.data.success) {
        toast.info('Registration cancelled');
        fetchEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unregister');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const res = await api.delete(`/events/${eventId}`);
      if (res.data.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const isUserRegistered = (event) => {
    return event.registeredUsers?.some(
      (regUser) =>
        (regUser._id || regUser) === (user?.id || user?._id)
    );
  };

  const canModifyEvent = (event) => {
    if (isAdmin) return true;
    if (isFaculty && event.organizer?._id === user?.id) return true;
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
            Campus Events
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Workshops, seminars, hackathons, and cultural gatherings ({totalCount} total)
          </p>
        </div>

        {canCreate && (
          <Link to="/events/create" className="btn btn-primary">
            <PlusCircle size={18} /> Create New Event
          </Link>
        )}
      </div>

      {/* Filter toolbar */}
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
              placeholder="Search by title, venue..."
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

          {/* Timeline Filter */}
          <div>
            <select
              className="form-select"
              value={timeline}
              onChange={(e) => {
                setTimeline(e.target.value);
                setPage(1);
              }}
            >
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
              <option value="all">All Dates</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-secondary">
            Apply Filters
          </button>
        </form>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <Loader message="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Try modifying your search or switching between upcoming/past filters."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {events.map((event) => {
            const registered = isUserRegistered(event);
            const regCount = event.registeredUsers?.length || 0;
            const isFull = regCount >= event.capacity;
            const percentFilled = Math.min(100, Math.round((regCount / event.capacity) * 100));

            const statusBadgeClass =
              event.status === 'upcoming'
                ? 'badge-primary'
                : event.status === 'ongoing'
                ? 'badge-warning'
                : event.status === 'completed'
                ? 'badge-success'
                : 'badge-danger';

            return (
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <span className={`badge ${statusBadgeClass}`}>
                      {event.status}
                    </span>
                    {registered && (
                      <span className="badge badge-success">
                        <CheckCircle size={12} /> Registered
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem', lineHeight: 1.3 }}>
                    <Link to={`/events/${event._id}`} style={{ color: 'var(--text-main)' }}>
                      {event.title}
                    </Link>
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
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

                  {/* Metadata List */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      color: '#475569',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="var(--primary)" />
                      <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
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

                  {/* Capacity Bar */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        marginBottom: '0.3rem'
                      }}
                    >
                      <span>Capacity: {regCount} / {event.capacity} spots</span>
                      <span>{percentFilled}% full</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${percentFilled}%`,
                          background: isFull ? 'var(--danger)' : 'var(--primary)',
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                    View Details
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Student Registration Button */}
                    {event.status === 'upcoming' && (
                      registered ? (
                        <button
                          onClick={() => handleUnregister(event._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Cancel Registration
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={isFull}
                          className="btn btn-primary btn-sm"
                        >
                          {isFull ? 'Sold Out' : 'Register Now'}
                        </button>
                      )
                    )}

                    {/* Faculty/Admin Management buttons */}
                    {canModifyEvent(event) && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Link
                          to={`/events/edit/${event._id}`}
                          className="btn btn-secondary btn-sm"
                          title="Edit Event"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
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

export default Events;

