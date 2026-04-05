import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { 
    applyLeave, getMyLeaves, getLeaveById, updateLeave, deleteLeave, 
    getCoordinatorRequests, coordApprove, coordReject,
    getClassInchargeRequests, ciApprove, ciModify, ciReject,
    getHodRequests, hodApprove, hodReject
} from "../controllers/leaveController.js";

const router = express.Router();

// Student Routes
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);

router.put("/:id", protect, updateLeave);
router.delete("/delete/:id", protect, deleteLeave);

// Coordinator Routes
// Only users registered with role 'coordinator' can access these
router.get("/coordinator", protect, authorizeRoles("coordinator"), getCoordinatorRequests);
router.patch("/:id/coord-approve", protect, authorizeRoles("coordinator"), coordApprove);
router.patch("/:id/coord-reject", protect, authorizeRoles("coordinator"), coordReject);

// Class Incharge (Faculty) Routes
router.get("/faculty", protect, authorizeRoles("faculty"), getClassInchargeRequests);
router.patch("/:id/ci-approve", protect, authorizeRoles("faculty"), ciApprove);
router.patch("/:id/ci-modify", protect, authorizeRoles("faculty"), ciModify);
router.patch("/:id/ci-reject", protect, authorizeRoles("faculty"), ciReject);

// HOD Routes
router.get("/hod", protect, authorizeRoles("hod"), getHodRequests);
router.patch("/:id/hod-approve", protect, authorizeRoles("hod"), hodApprove);
router.patch("/:id/hod-reject", protect, authorizeRoles("hod"), hodReject);

// Get by ID should be last so it doesn't mistakenly catch /coordinator or /faculty
router.get("/:id", protect, getLeaveById); // added for Timeline UI tracking

export default router;
