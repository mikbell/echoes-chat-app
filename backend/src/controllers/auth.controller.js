import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { HTTP_STATUS, ERROR_MESSAGES, PASSWORD_CONFIG } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    logger.request('POST', '/auth/signup');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn('Signup attempt with existing email', { email });
      return res.status(HTTP_STATUS.CONFLICT).json({ 
        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS 
      });
    }

    // Hash password with improved salt rounds
    const salt = await bcrypt.genSalt(PASSWORD_CONFIG.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();
    logger.database('CREATE', 'users', { userId: newUser._id });
    
    // Generate JWT token
    generateToken(newUser._id, res);

    // Return user data (excluding password)
    res.status(HTTP_STATUS.CREATED).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
    
    logger.info('User successfully created', { userId: newUser._id });
    
  } catch (error) {
    logger.error('Error in signup controller', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    logger.request('POST', '/auth/login');
    
    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.INVALID_CREDENTIALS 
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      logger.warn('Login attempt with incorrect password', { email, userId: user._id });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.INVALID_CREDENTIALS 
      });
    }

    // Generate JWT token
    generateToken(user._id, res);

    // Return user data (excluding password)
    res.status(HTTP_STATUS.OK).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
    
    logger.info('User successfully logged in', { userId: user._id });
    
  } catch (error) {
    logger.error('Error in login controller', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};

export const logout = (req, res) => {
  try {
    logger.request('POST', '/auth/logout', req.user?._id);
    
    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });
    
    res.status(HTTP_STATUS.OK).json({ message: "Logged out successfully" });
    
    logger.info('User successfully logged out', { userId: req.user?._id });
    
  } catch (error) {
    logger.error('Error in logout controller', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    
    logger.request('PUT', '/auth/update-profile', userId);

    if (!profilePic) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Profile picture is required" 
      });
    }

    // Upload image to cloudinary with error handling
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'echoes/profiles',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        message: ERROR_MESSAGES.USER_NOT_FOUND 
      });
    }

    res.status(HTTP_STATUS.OK).json(updatedUser);
    
    logger.info('Profile updated successfully', { userId });
    
  } catch (error) {
    logger.error('Error in updateProfile controller', error);
    
    if (error.name === 'CastError') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: 'Invalid user ID' 
      });
    }
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    logger.request('GET', '/auth/check', req.user._id);
    
    res.status(HTTP_STATUS.OK).json(req.user);
    
  } catch (error) {
    logger.error('Error in checkAuth controller', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
};
