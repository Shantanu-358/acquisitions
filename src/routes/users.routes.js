import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/users.controller.js';
import {
  authenticateToken,
  requireOwnershipOrAdmin,
} from '#middleware/auth.middleware.js';

const router = express.Router();

// GET /users - Get all users (authenticated)
router.get('/', authenticateToken, fetchAllUsers);

// GET /users/:id - Get user by ID (authenticated)
router.get('/:id', authenticateToken, fetchUserById);

// PUT /users/:id - Update user (authenticated)
router.put('/:id', authenticateToken, updateUserById);

// DELETE /users/:id - Delete user (own profile or admin)
router.delete(
  '/:id',
  authenticateToken,
  requireOwnershipOrAdmin(),
  deleteUserById
);

export default router;
