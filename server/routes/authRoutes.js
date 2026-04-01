import express from "express";
import { register, login, changePassword, updateProfilePic } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.put("/change-password", protect, changePassword);
router.put("/profile-pic", protect, upload.single("profilePic"), updateProfilePic);

export default router;
