import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { applyLeave, getMyLeaves, updateLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);
router.put("/:id", protect, updateLeave);

export default router;
