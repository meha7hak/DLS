import Leave from "../models/leaveModel.js";

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
            slots
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
            if (leave.status !== "Rejected") {
                return res.status(400).json({ message: "You can only edit rejected leaves." });
            }

            const { eventName, eventDate, coordinatorName, coordinatorEmail, department, coordinatorPhone, slots } = req.body;
            
            leave.eventName = eventName || leave.eventName;
            leave.eventDate = eventDate || leave.eventDate;
            leave.coordinatorName = coordinatorName || leave.coordinatorName;
            leave.coordinatorEmail = coordinatorEmail || leave.coordinatorEmail;
            leave.department = department || leave.department;
            leave.coordinatorPhone = coordinatorPhone || leave.coordinatorPhone;
            leave.slots = slots || leave.slots;
            leave.status = 'Pending Coordinator'; // Reset status when resubmitting
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
