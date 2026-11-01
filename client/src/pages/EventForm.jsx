import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { ArrowLeft, Save, Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '10:00 AM',
    capacity: 50,
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/events/${id}`);
          if (res.data.success) {
            const ev = res.data.event;
            setFormData({
              title: ev.title,
              description: ev.description,
              venue: ev.venue,
              date: ev.date ? ev.date.split('T')[0] : '',
              time: ev.time,
              capacity: ev.capacity,
              status: ev.status
            });
          }
        } catch (error) {
          toast.error('Failed to load event details for editing');
          navigate('/events');
        } finally {
          setFetchLoading(false);
        }
      };

      fetchEvent();
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
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.venue.trim() ||
      !formData.date ||
      !formData.time.trim() ||
      Number(formData.capacity) <= 0
    ) {
      toast.error('Please fill in all required event details with valid values');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/events/${id}`, formData);
        toast.success('Event updated successfully');
        navigate(`/events/${id}`);
      } else {
        await api.post('/events', formData);
        toast.success('Event created and published');
        navigate('/events');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Loader fullScreen message="Loading event details..." />;
  }

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/events" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      <Card style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#059669',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {isEdit ? 'Edit Event' : 'Schedule New Campus Event'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {isEdit ? 'Update event parameters and capacity' : 'Publish an institutional event or workshop'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. AI & Cloud Architecture Hackathon 2026"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Venue / Location *</label>
              <input
                type="text"
                name="venue"
                className="form-input"
                placeholder="e.g. Auditorium Hall 1 / Lab B"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time *</label>
              <input
                type="text"
                name="time"
                className="form-input"
                placeholder="e.g. 10:00 AM - 04:00 PM"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Maximum Attendee Capacity *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                className="form-input"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Description & Program Details *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={7}
              placeholder="Outline event topics, schedule breakdown, eligibility, prerequisites, and prizes if any..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/events" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EventForm;

