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
                (role === "staff" && (user.role === "faculty" || user.role === "hod"));

            if (!hasValidRole) {
                return res.status(401).json({ message: "Role mismatch." });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid credentials." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
