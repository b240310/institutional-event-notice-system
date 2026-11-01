const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validate');

// User registrations route must be above /:id to prevent matching "my-registrations" as an ID
router.get('/my-registrations', protect, getMyRegistrations);

// All authenticated users can view events
router.get('/', protect, getEvents);
router.get('/:id', protect, getEventById);

// Admin and faculty can create/update/delete events
router.post('/', protect, authorizeRoles('admin', 'faculty'), validateEvent, createEvent);
router.put('/:id', protect, authorizeRoles('admin', 'faculty'), validateEvent, updateEvent);
router.delete('/:id', protect, authorizeRoles('admin', 'faculty'), deleteEvent);

// Register and unregister endpoints (student, faculty, admin)
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);

module.exports = router;

