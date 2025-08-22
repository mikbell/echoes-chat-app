import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authLimiter, uploadLimiter } from "../middleware/rateLimiter.js";
import { 
  validateRequest, 
  signupSchema, 
  loginSchema, 
  profilePicSchema 
} from "../utils/validation.js";

const router = express.Router();

// Apply rate limiting to authentication routes
router.post("/signup", authLimiter, validateRequest(signupSchema), signup);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/logout", logout);

// Apply upload rate limiting to profile update
router.put("/update-profile", uploadLimiter, protectRoute, validateRequest(profilePicSchema), updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
