import jwt from "jsonwebtoken";
import { JWT_CONFIG, ENVIRONMENTS } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const generateToken = (userId, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: JWT_CONFIG.EXPIRES_IN,
    });

    res.cookie(JWT_CONFIG.COOKIE_NAME, token, {
      maxAge: JWT_CONFIG.COOKIE_MAX_AGE,
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION,
    });

    logger.debug('JWT token generated', { userId });
    
    return token;
  } catch (error) {
    logger.error('Error generating JWT token', error);
    throw error;
  }
};
