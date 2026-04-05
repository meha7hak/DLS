import Leave from "../models/leaveModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const applyLeave = async (req, res) => {
    try {
        const { eventName, eventDate, coordinatorName, coordinatorEmail, department, coordinatorPhone, slots } = req.body;
        
        const leave = new Leave({
            student: req.user._id,
            eventName,
            eventDate,
            coordinatorName,
            coordinatorEmail,
            department,
            coordinatorPhone,
            slots,
            status: "Pending ClassIncharge"
        });

        const createdLeave = await leave.save();
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

export const updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (leave && leave.student.toString() === req.user._id.toString()) {
            if (leave.status !== "Rejected" && !leave.status.includes("Pending")) {
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
            leave.status = 'Pending ClassIncharge'; // Reset status when resubmitting
            leave.rejectionReason = null;

            const updatedLeave = await leave.save();
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
            if (leave.status === "Approved") {
                return res.status(400).json({ message: "Cannot delete approved leaves." });
            }
            await leave.deleteOne();
            res.json({ message: "Leave deleted successfully." });
        } else {
            res.status(404).json({ message: "Leave not found or unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// FACULTY (CLASS INCHARGE) ENDPOINTS
export const getClassInchargeRequests = async (req, res) => {
    try {
        // Faculty handles only their semester and department
        const leaves = await Leave.find({ status: "Pending ClassIncharge" })
            .populate({
                path: 'student',
                match: { semester: req.user.semester, department: req.user.department },
                select: 'name rollno semester department'
            })
            .sort({ createdAt: -1 });

        // Filter out null populations (students not in faculty's sem/dept)
        const filteredLeaves = leaves.filter(l => l.student != null);
        res.json(filteredLeaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const approveByClassIncharge = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id).populate('student', 'name rollno');
        if (leave && leave.status === "Pending ClassIncharge") {
            leave.status = "Pending Coordinator";
            await leave.save();

            // Send Email to Coordinator
            const approveUrl = `${process.env.VITE_API_BASE_URL || "http://localhost:7800"}/api/leave/coordinator-approve/${leave._id}`;
            const rejectUrl = `${process.env.VITE_API_BASE_URL || "http://localhost:7800"}/api/leave/coordinator-reject/${leave._id}`;
            const emailHtml = `
                <h3>Duty Leave Request</h3>
                <p>Hello <b>${leave.coordinatorName}</b>,</p>
                <p>Student <b>${leave.student.name}</b> (${leave.student.rollno}) has applied for a duty leave for the event: <b>${leave.eventName}</b> on <b>${new Date(leave.eventDate).toLocaleDateString()}</b>.</p>
                <p>This request has been approved by their Class Incharge and now requires your approval as the event coordinator.</p>
                <a href="${approveUrl}" style="background-color:green; color:white; padding:10px;text-decoration:none;">Approve</a>
                <a href="${rejectUrl}" style="background-color:red; color:white; padding:10px; text-decoration:none; margin-left:10px;">Reject</a>
            `;

            try {
                await sendEmail({
                    to: leave.coordinatorEmail,
                    subject: `Duty Leave Approval Needed: ${leave.student.name}`,
                    text: `Duty Leave Approval Needed for ${leave.student.name}`,
                    html: emailHtml
                });

                res.json({ message: "Leave approved by Class Incharge and email sent to coordinator" });
            } catch (emailError) {
                // Should we revert the leave status if email fails?
                // Probably yes, to avoid it being stuck.
                leave.status = "Pending ClassIncharge";
                await leave.save();
                res.status(500).json({ message: "Leave approved but failed to send email. Please try again.", error: emailError.message });
            }
        } else {
            res.status(404).json({ message: "Leave not found or invalid status" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const rejectByClassIncharge = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.status === "Pending ClassIncharge") {
            leave.status = "Rejected";
            leave.rejectionReason = req.body.reason || "Rejected by Class Incharge";
            await leave.save();
            res.json({ message: "Leave rejected by Class Incharge" });
        } else {
            res.status(404).json({ message: "Leave not found or invalid status" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// COORDINATOR ENDPOINTS
export const approveByCoordinator = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.status === "Pending Coordinator") {
            leave.status = "Pending HOD";
            await leave.save();
            res.send("<h3>Leave Approved Successfully. The request has been forwarded to the HOD.</h3>");
        } else {
            res.status(400).send("<h3>Invalid Request or already processed.</h3>");
        }
    } catch (error) {
        res.status(500).send("<h3>Server Error</h3>");
    }
};

export const rejectByCoordinator = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.status === "Pending Coordinator") {
            leave.status = "Rejected";
            leave.rejectionReason = "Rejected by Event Coordinator via Email";
            await leave.save();
            res.send("<h3>Leave Rejected Successfully.</h3>");
        } else {
            res.status(400).send("<h3>Invalid Request or already processed.</h3>");
        }
    } catch (error) {
        res.status(500).send("<h3>Server Error</h3>");
    }
};


// HOD ENDPOINTS
export const getHodRequests = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: "Pending HOD" })
            .populate('student', 'name rollno semester department')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const approveByHod = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.status === "Pending HOD") {
            leave.status = "Approved";
            await leave.save();
            res.json({ message: "Leave fully approved by HOD." });
        } else {
            res.status(404).json({ message: "Leave not found or invalid status" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const rejectByHod = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave && leave.status === "Pending HOD") {
            leave.status = "Rejected";
            leave.rejectionReason = req.body.reason || "Rejected by HOD";
            await leave.save();
            res.json({ message: "Leave rejected by HOD" });
        } else {
            res.status(404).json({ message: "Leave not found or invalid status" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
