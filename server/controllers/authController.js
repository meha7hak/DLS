import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d"
    });
};

export const register = async (req, res) => {
    const { name, email, password, role, rollno, employeeID, department, semester } = req.body;

    try {
        // Validation check
        if (!name || !password || !role) {
            return res.status(400).json({ message: "Name, password and role are required." });
        }

        // Check if user exists
        const query = [];
        if (email) query.push({ email });
        if (rollno) query.push({ rollno });
        if (employeeID) query.push({ employeeID });

        if (query.length > 0) {
            const userExists = await User.findOne({ $or: query });
            if (userExists) {
                return res.status(400).json({ message: "User already exists with given credentials." });
            }
        }

        // Check if a faculty already exists for the given department and semester
        if (role === "faculty" && department && semester) {
            const facultyExists = await User.findOne({ role: "faculty", department, semester });
            if (facultyExists) {
                return res.status(400).json({ message: `A Class Incharge (Faculty) for ${department} - Semester ${semester} already exists.` });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            rollno,
            employeeID,
            department,
            semester
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollno: user.rollno,
                employeeID: user.employeeID,
                department: user.department,
                semester: user.semester,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const login = async (req, res) => {
    const { identifier, password, role } = req.body;
    // identifier could be rollno (for students) or email (for staff)

    try {
        let user;

        if (role === "student") {
            user = await User.findOne({ rollno: identifier });
        } else {
            user = await User.findOne({ email: identifier });
        }

        if (user && (await user.matchPassword(password))) {
            const hasValidRole =
                user.role === role ||
                (role === "staff" && (user.role === "faculty" || user.role === "hod" || user.role === "coordinator"));

            if (!hasValidRole) {
                return res.status(401).json({ message: "Wrong panel to login" });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollno: user.rollno,
                employeeID: user.employeeID,
                department: user.department,
                semester: user.semester,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid credentials." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(400).json({ message: "Incorrect old password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image provided" });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            user.profilePic = req.file.path; // Cloudinary secure_url is returned here via multer-storage-cloudinary
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                rollno: updatedUser.rollno,
                employeeID: updatedUser.employeeID,
                department: updatedUser.department,
                semester: updatedUser.semester,
                profilePic: updatedUser.profilePic,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
