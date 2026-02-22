import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { getUserById } from '#services/users.service.js';

/**
 * Middleware to verify JWT token and populate req.user
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      logger.warn('Access attempted without token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    // Verify the token
    const decoded = jwttoken.verify(token);

    // Get user details from database to ensure user still exists
    const user = await getUserById(decoded.id);

    // Attach user to request object (excluding password)
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    logger.info(`User ${user.email} authenticated successfully`);
    next();
  } catch (e) {
    if (e.message === 'User not found') {
      logger.warn('Token valid but user no longer exists');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token - user not found',
      });
    }

    logger.warn('Token verification failed:', e.message);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 */
export const requireRole = allowedRoles => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Role check attempted without authentication');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user.id} with role ${req.user.role} attempted to access resource requiring roles: ${roles.join(', ')}`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can access their own resource or is admin
 * @param {string} paramName - The parameter name containing the user ID (default: 'id')
 */
export const requireOwnershipOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Ownership check attempted without authentication');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const resourceUserId = parseInt(req.params[paramName]);

    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      next();
    } else {
      logger.warn(
        `User ${req.user.id} attempted to access resource belonging to user ${resourceUserId}`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own resources',
      });
    }
  };
};

/**
 * Optional authentication - sets req.user if token is provided but doesn't fail if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwttoken.verify(token);
      const user = await getUserById(decoded.id);

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }

    next();
  } catch (e) {
    // For optional auth, we continue even if token is invalid
    logger.info(
      'Optional auth failed, continuing without user context:',
      e.message
    );
    next();
  }
};
