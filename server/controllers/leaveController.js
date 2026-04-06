import Leave from "../models/leaveModel.js";
import LeaveLog from "../models/leaveLogModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// Helper to log actions
const logAction = async (leaveId, action, actorId, role, reason = null) => {
    try {
        await LeaveLog.create({ leaveId, action, actorId, role, reason });
    } catch (error) {
        console.error("Error creating leave log:", error);
    }
};

export const applyLeave = async (req, res) => {
    try {
        const { eventName, eventDate, coordinatorName, coordinatorEmail, department, coordinatorPhone, slots } = req.body;
        
        const leave = new Leave({
            student: req.user._id,
            eventName,
            eventDate,
            coordinatorName,
            coordinatorEmail: (coordinatorEmail || "").trim(),
            department,
            coordinatorPhone,
            slots,
            status: "PENDING_COORDINATOR"
        });

        const createdLeave = await leave.save();
        await logAction(createdLeave._id, "SUBMITTED", req.user._id, req.user.role);

        // Notify Coordinator
        const io = req.app.get('io');
        if (io) io.emit("leaveCreated", createdLeave);

        const baseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
        const dashboardUrl = `${baseUrl}/`;
        try {
            await sendEmail({
                to: coordinatorEmail,
                subject: `Duty Leave Request Pending: ${req.user.name}`,
                text: `A new duty leave request has been submitted by ${req.user.name}.`,
                html: `
                    <h3>New Duty Leave Request</h3>
                    <p>${req.user.name} applied duty leave for ${eventName} from ${department}</p>
                    <a href="${dashboardUrl}" style="background-color:#0D9488; color:white; padding:10px 15px;text-decoration:none; border-radius:5px;">Go To Dashboard</a>
                `
            });
        } catch (e) {
            console.error("Email send warning: ", e);
        }

        res.status(201).json(createdLeave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getLeaveById = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id).populate('student', 'name rollno semester department');
        if (!leave) return res.status(404).json({ message: "Not found" });
        
        // Also fetch the logs to build Timeline UI on frontend
        const logs = await LeaveLog.find({ leaveId: leave._id }).sort({ createdAt: 1 });
        
        res.json({ leave, logs });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (leave && leave.student.toString() === req.user._id.toString()) {
            if (!leave.status.includes("REJECTED") && !leave.status.includes("PENDING")) {
                return res.status(400).json({ message: "You cannot edit processed leaves." });
            }

            const { eventName, eventDate, coordinatorName, coordinatorEmail, department, coordinatorPhone, slots } = req.body;
            
            leave.eventName = eventName || leave.eventName;
            leave.eventDate = eventDate || leave.eventDate;
            leave.coordinatorName = coordinatorName || leave.coordinatorName;
            leave.coordinatorEmail = coordinatorEmail || leave.coordinatorEmail;
            leave.department = department || leave.department;
            leave.coordinatorPhone = coordinatorPhone || leave.coordinatorPhone;
            leave.slots = slots || leave.slots;
            leave.status = 'PENDING_COORDINATOR'; // Reset status when resubmitting
            leave.rejectionReason = null;

            const updatedLeave = await leave.save();
            await logAction(updatedLeave._id, "UPDATED", req.user._id, req.user.role);

            const io = req.app.get('io');
            if (io) io.emit("leaveUpdated", updatedLeave);

            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: "Leave not found or unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.student.toString() === req.user._id.toString()) {
            if (leave.status === "FINAL_APPROVED" || leave.status === "APPROVED_BY_HOD") {
                return res.status(400).json({ message: "Cannot delete approved leaves." });
            }
            await leave.deleteOne();
            await LeaveLog.deleteMany({ leaveId: leave._id });
            res.json({ message: "Leave deleted successfully." });
        } else {
            res.status(404).json({ message: "Leave not found or unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------------------------------------------------
// COORDINATOR ENDPOINTS
// ---------------------------------------------------------
export const getCoordinatorRequests = async (req, res) => {
    try {
        // Find pending leaves mapped to this coordinator's email OR generic status
        // Use req.query.status logic if provided, but default to pending
        const filterStatus = req.query.status || "PENDING_COORDINATOR";

        const query = { coordinatorEmail: { $regex: new RegExp(`^${(req.user.email || "").trim()}$`, "i") } };
        if (filterStatus !== "ALL") {
            query.status = filterStatus;
        }

        const leaves = await Leave.find(query)
        .populate('student', 'name rollno semester department')
        .sort({ createdAt: -1 });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const coordApprove = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });
        if (leave.coordinatorEmail !== req.user.email) return res.status(403).json({ message: "Forbidden" });

        leave.status = "PENDING_CI";
        await leave.save();
        await logAction(leave._id, "APPROVED_BY_COORD", req.user._id, "coordinator");

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const coordReject = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });
        if (leave.coordinatorEmail !== req.user.email) return res.status(403).json({ message: "Forbidden" });

        const reason = req.body.reason || "Rejected by Coordinator";
        leave.status = "REJECTED_BY_COORD";
        leave.rejectionReason = reason;
        await leave.save();
        await logAction(leave._id, "REJECTED_BY_COORD", req.user._id, "coordinator", reason);

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------------------------------------------------
// CLASS INCHARGE ENDPOINTS
// ---------------------------------------------------------
export const getClassInchargeRequests = async (req, res) => {
    try {
        const filterStatus = req.query.status || "PENDING_CI";
        const query = {};
        if (filterStatus !== "ALL") {
            query.status = filterStatus;
        }

        const leaves = await Leave.find(query)
            .populate({
                path: 'student',
                match: { semester: req.user.semester, department: req.user.department },
                select: 'name rollno semester department'
            })
            .sort({ createdAt: -1 });

        const filteredLeaves = leaves.filter(l => l.student != null);
        res.json(filteredLeaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const ciApprove = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });
        
        leave.status = "PENDING_HOD";
        await leave.save();
        await logAction(leave._id, "APPROVED_BY_CI", req.user._id, "faculty");

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const ciModify = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });
        
        const { modifiedSlots } = req.body;
        if (!modifiedSlots) return res.status(400).json({ message: "Missing slots" });

        const originalSlots = leave.slots;
        leave.slots = modifiedSlots;
        leave.status = "PENDING_HOD";
        await leave.save();

        const logMsg = "Slots modified directly";
        await logAction(leave._id, "MODIFIED_BY_CI", req.user._id, "faculty", logMsg);

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const ciReject = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });

        const reason = req.body.reason || "Rejected by Class Incharge";
        leave.status = "REJECTED_BY_CI";
        leave.rejectionReason = reason;
        await leave.save();
        
        await logAction(leave._id, "REJECTED_BY_CI", req.user._id, "faculty", reason);

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ---------------------------------------------------------
// HOD ENDPOINTS
// ---------------------------------------------------------
export const getHodRequests = async (req, res) => {
    try {
        const filterStatus = req.query.status || "PENDING_HOD";
        // HOD sees all from their department
        const leaves = await Leave.find({ status: filterStatus })
            .populate({
                path: 'student',
                match: { department: req.user.department },
                select: 'name rollno semester department'
            })
            .sort({ createdAt: -1 });

        const filteredLeaves = leaves.filter(l => l.student != null);
        res.json(filteredLeaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const hodApprove = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });

        leave.status = "FINAL_APPROVED";
        await leave.save();
        
        await logAction(leave._id, "FINAL_APPROVED", req.user._id, "hod");

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const hodReject = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Not found" });

        const reason = req.body.reason || "Rejected by HOD";
        leave.status = "REJECTED_BY_HOD";
        leave.rejectionReason = reason;
        await leave.save();

        await logAction(leave._id, "REJECTED_BY_HOD", req.user._id, "hod", reason);

        const io = req.app.get('io');
        if (io) io.emit("leaveUpdated", leave);

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
