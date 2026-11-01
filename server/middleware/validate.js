/**
 * Validation middleware functions for incoming request bodies
 */

// Helper to check valid email format
const isValidEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const validateRegister = (req, res, next) => {
  const { name, email, password, department, role } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  if (!department || department.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Department is required' });
  }

  if (role && !['admin', 'faculty', 'student'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be admin, faculty, or student'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

const validateNotice = (req, res, next) => {
  const { title, description, category, priority } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }

  const validCategories = ['academic', 'administrative', 'sports', 'cultural', 'general'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${validCategories.join(', ')}`
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${validPriorities.join(', ')}`
    });
  }

  next();
};

const validateEvent = (req, res, next) => {
  const { title, description, venue, date, time, capacity } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }

  if (!venue || venue.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Venue is required' });
  }

  if (!date || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ success: false, message: 'Valid date is required' });
  }

  if (!time || time.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Time is required' });
  }

  if (!capacity || Number(capacity) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Capacity must be a positive number'
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateNotice,
  validateEvent
};

