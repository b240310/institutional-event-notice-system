const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Any authenticated user can update their own profile
router.put('/profile', protect, updateProfile);

// Admin-only user management routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id/role', protect, authorizeRoles('admin'), updateUserRole);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;

