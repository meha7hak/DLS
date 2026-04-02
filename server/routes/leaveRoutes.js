import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    applyLeave, getMyLeaves, updateLeave, deleteLeave, 
    getClassInchargeRequests, approveByClassIncharge, rejectByClassIncharge,
    approveByCoordinator, rejectByCoordinator,
    getHodRequests, approveByHod, rejectByHod
} from "../controllers/leaveController.js";

const router = express.Router();

// Student Routes
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);
router.put("/:id", protect, updateLeave);
router.delete("/delete/:id", protect, deleteLeave);

// Faculty (Class Incharge) Routes
router.get("/faculty-requests", protect, getClassInchargeRequests);
router.put("/faculty-approve/:id", protect, approveByClassIncharge);
router.put("/faculty-reject/:id", protect, rejectByClassIncharge);

// Coordinator Routes (Public/Token-based via Email, keeping public for simplicity as requested since it's an email link without login)
router.get("/coordinator-approve/:id", approveByCoordinator);
router.get("/coordinator-reject/:id", rejectByCoordinator);

// HOD Routes
router.get("/hod-requests", protect, getHodRequests);
router.put("/hod-approve/:id", protect, approveByHod);
router.put("/hod-reject/:id", protect, rejectByHod);

export default router;
