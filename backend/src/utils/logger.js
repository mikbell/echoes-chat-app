import { ENVIRONMENTS } from '../constants/index.js';

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT;
  }

  // Log info messages (always log in development, conditional in production)
  info(message, meta = {}) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta);
    }
  }

  // Log error messages (always log, but sanitize sensitive data in production)
  error(message, error = null) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // In production, log error without sensitive details
      console.error(`[ERROR] ${message}`, {
        timestamp: new Date().toISOString(),
        stack: error?.stack?.split('\n')[0] // Only first line of stack
      });
    }
  }

  // Log warning messages
  warn(message, meta = {}) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, meta);
    }
  }

  // Debug messages (only in development)
  debug(message, meta = {}) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }

  // Log HTTP requests (development only)
  request(method, url, userId = null) {
    if (this.isDevelopment) {
      console.log(`[REQUEST] ${method} ${url}${userId ? ` - User: ${userId}` : ''}`);
    }
  }

  // Log database operations (development only)
  database(operation, collection, meta = {}) {
    if (this.isDevelopment) {
      console.log(`[DB] ${operation} on ${collection}`, meta);
    }
  }
}

// Create singleton instance
export const logger = new Logger();
