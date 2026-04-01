import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    coordinatorName: { type: String, required: true },
    coordinatorEmail: { type: String, required: true },
    department: { type: String, required: true },
    coordinatorPhone: { type: String, required: true },
    slots: [{ type: Number }],
    status: { type: String, enum: ['Pending', 'Pending Coordinator', 'Approved', 'Rejected'], default: 'Pending Coordinator' },
    rejectionReason: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);