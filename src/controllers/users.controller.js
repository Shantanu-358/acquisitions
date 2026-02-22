import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/users.service.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Users retrieved successfully',
      users: allUsers,
      count: allUsers.length
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      logger.warn('Invalid user ID provided', { errors: validation.error.errors });
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID',
        details: validation.error.errors
      });
    }

    const { id } = validation.data;
    logger.info(`Fetching user with ID: ${id}`);

    const user = await getUserById(id);

    res.json({
      message: 'User retrieved successfully',
      user
    });
  } catch (e) {
    if (e.message === 'User not found') {
      logger.warn(`User not found: ${req.params.id}`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    logger.error('Error fetching user by ID:', e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const paramsValidation = userIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      logger.warn('Invalid user ID provided for update', { errors: paramsValidation.error.errors });
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID',
        details: paramsValidation.error.errors
      });
    }

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      logger.warn('Invalid update data provided', { errors: bodyValidation.error.errors });
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid update data',
        details: bodyValidation.error.errors
      });
    }

    const { id } = paramsValidation.data;
    const updates = bodyValidation.data;

    // Only admins can change user roles
    if (updates.role && req.user.role !== 'admin') {
      logger.warn(`Non-admin user ${req.user.id} attempted to change user role`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles'
      });
    }

    logger.info(`User ${req.user.id} updating user ${id}`);
        
    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (e) {
    if (e.message === 'User not found') {
      logger.warn(`User not found for update: ${req.params.id}`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    logger.error('Error updating user:', e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      logger.warn('Invalid user ID provided for deletion', { errors: validation.error.errors });
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user ID',
        details: validation.error.errors
      });
    }

    const { id } = validation.data;

    // Prevent users from deleting themselves if they're the last admin
    if (req.user.role === 'admin' && req.user.id === id) {
      // Check if there are other admins (this is a safety measure)
      const allUsers = await getAllUsers();
      const adminCount = allUsers.filter(user => user.role === 'admin').length;
            
      if (adminCount <= 1) {
        logger.warn(`Last admin user ${id} attempted to delete their own account`);
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Cannot delete the last administrator account'
        });
      }
    }

    logger.info(`User ${req.user.id} deleting user ${id}`);
        
    const deletedUser = await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (e) {
    if (e.message === 'User not found') {
      logger.warn(`User not found for deletion: ${req.params.id}`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    logger.error('Error deleting user:', e);
    next(e);
  }
};
