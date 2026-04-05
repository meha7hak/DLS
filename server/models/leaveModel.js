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
    status: { 
        type: String, 
        enum: [
            'PENDING_COORDINATOR', 'APPROVED_BY_COORD', 'REJECTED_BY_COORD', 
            'PENDING_CI', 'APPROVED_BY_CI', 'MODIFIED_BY_CI', 'REJECTED_BY_CI', 
            'PENDING_HOD', 'FINAL_APPROVED', 'REJECTED_BY_HOD'
        ], 
        default: 'PENDING_COORDINATOR' 
    },
    rejectionReason: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);