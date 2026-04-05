import mongoose from "mongoose";

const leaveLogSchema = new mongoose.Schema({
    leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave', required: true },
    action: { type: String, required: true }, // e.g., PENDING_COORDINATOR, APPROVED_BY_COORD
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if system action
    role: { type: String }, // e.g., student, coordinator, faculty, hod, system
    reason: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("LeaveLog", leaveLogSchema);
