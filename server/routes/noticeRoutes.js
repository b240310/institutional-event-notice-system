const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect, authorizeRoles } = require('../middleware/auth');
const { validateNotice } = require('../middleware/validate');

// All authenticated users can read notices
router.get('/', protect, getNotices);
router.get('/:id', protect, getNoticeById);

// Admin and faculty can create/update/delete notices
router.post('/', protect, authorizeRoles('admin', 'faculty'), validateNotice, createNotice);
router.put('/:id', protect, authorizeRoles('admin', 'faculty'), validateNotice, updateNotice);
router.delete('/:id', protect, authorizeRoles('admin', 'faculty'), deleteNotice);

module.exports = router;

