const Event = require('../models/Event');

/**
 * @desc    Get all events with search, status filter, and pagination
 * @route   GET /api/events
 * @access  Private / Authenticated
 */
const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Filter by upcoming vs past
    if (req.query.timeline === 'upcoming') {
      query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    } else if (req.query.timeline === 'past') {
      query.date = { $lt: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    // Search query on title, description, or venue
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { venue: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // If faculty wants to see only their events
    if (req.query.myEvents === 'true') {
      query.organizer = req.user._id;
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Private / Authenticated
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin, Faculty)
 */
const createEvent = async (req, res, next) => {
  try {
    const { title, description, venue, date, time, capacity, status } = req.body;

    const event = await Event.create({
      title,
      description,
      venue,
      date: new Date(date),
      time,
      capacity: Number(capacity),
      status: status || 'upcoming',
      organizer: req.user._id,
      registeredUsers: []
    });

    const populated = await Event.findById(event._id).populate(
      'organizer',
      'name email department'
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Admin or Organizer Faculty)
 */
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Role check: Only admin or organizer can update
    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }

    const { title, description, venue, date, time, capacity, status } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (venue) event.venue = venue;
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (capacity) {
      if (Number(capacity) < event.registeredUsers.length) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than current registrations count (${event.registeredUsers.length})`
        });
      }
      event.capacity = Number(capacity);
    }
    if (status) event.status = status;

    const updatedEvent = await event.save();
    const populated = await Event.findById(updatedEvent._id)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin or Organizer Faculty)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Role check: Only admin or organizer can delete
    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register current user for an event
 * @route   POST /api/events/:id/register
 * @access  Private (Student, Faculty, Admin)
 */
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is cancelled or completed
    if (['cancelled', 'completed'].includes(event.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot register: Event is marked as ${event.status}`
      });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredUsers.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check capacity limit
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'This event has reached full capacity'
      });
    }

    // Add user to registeredUsers
    event.registeredUsers.push(req.user._id);
    await event.save();

    const populated = await Event.findById(event._id)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role');

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      event: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unregister current user from an event
 * @route   POST /api/events/:id/unregister
 * @access  Private (Student, Faculty, Admin)
 */
const unregisterFromEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isRegistered = event.registeredUsers.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await event.save();

    const populated = await Event.findById(event._id)
      .populate('organizer', 'name email department')
      .populate('registeredUsers', 'name email department role');

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
      event: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events current user has registered for
 * @route   GET /api/events/my-registrations
 * @access  Private
 */
const getMyRegistrations = async (req, res, next) => {
  try {
    const events = await Event.find({
      registeredUsers: req.user._id
    })
      .populate('organizer', 'name email department')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations
};

