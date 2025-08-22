import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { HTTP_STATUS, ERROR_MESSAGES, JWT_CONFIG } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies[JWT_CONFIG.COOKIE_NAME];

    if (!token) {
      logger.warn('Unauthorized access attempt - no token provided', { ip: req.ip });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.NO_TOKEN_PROVIDED 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      logger.warn('Invalid token provided', { error: jwtError.message, ip: req.ip });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.INVALID_TOKEN 
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      logger.warn('Token valid but user not found', { userId: decoded.userId });
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        message: ERROR_MESSAGES.USER_NOT_FOUND 
      });
    }

    req.user = user;
    
    logger.debug('User authenticated successfully', { userId: user._id });
    next();
    
  } catch (error) {
    logger.error('Error in protectRoute middleware', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};
