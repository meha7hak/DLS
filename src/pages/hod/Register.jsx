import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { EyeIcon } from "../../components/ui/eye";
import { EyeClosedIcon } from "../../components/ui/eye-closed";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../components/ui/accordion";
import Particles from "../../components/Particles";

function HodRegister() {
    const navigate = useNavigate();

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Accordion Control State
    const [openAccordion, setOpenAccordion] = useState("");

    // Password Visibility States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Refs for animated icons
    const pwEyeRef = useRef(null);
    const confirmPwEyeRef = useRef(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Validation
        if (!name || !email || !department || !password || !confirmPassword) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        try {
            const payload = {
                name,
                email,
                password,
                role: 'hod',
                department
            };

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                navigate("/");
            } else {
                setErrorMsg(data.message || "Registration failed");
            }
        } catch (err) {
            setErrorMsg("Server error. Please try again later.");
        }
    };

    const departments = ["CSE"];

    return (
        <div style={bgStyle}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleColors={["#ffffff"]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover
                    alphaParticles={false}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>
            <div className="auth-card" style={cardStyle}>
                <img src={logo} alt="Logo" style={logoStyle} />
                <h2 style={{ marginBottom: "20px" }}>Register As HOD</h2>

                {errorMsg && <p style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>{errorMsg}</p>}

                <form onSubmit={handleRegister}>
                    <div className="register-grid">
                        {/* Row 1: Name and Email */}
                        <div style={{ width: '100%' }}>
                            <input
                                placeholder="Full Name"
                                style={{ ...inputStyle, marginBottom: 0 }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <input
                                placeholder="Email Address"
                                type="email"
                                style={{ ...inputStyle, marginBottom: 0 }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Row 2: Department Accordion */}
                        <div className="desktop-only" style={{ gridColumn: '1 / -1' }}>
                            <Accordion
                                type="single"
                                collapsible
                                value={openAccordion === "department" ? "department" : ""}
                                onValueChange={(val) => setOpenAccordion(val ? "department" : "")}
                                style={{ textAlign: "left", background: "#f8fafc", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                            >
                                <AccordionItem value="department" style={{ borderBottom: "none" }}>
                                    <AccordionTrigger style={{ padding: "12px", fontSize: "14px", color: department ? "#000" : "#757575" }}>
                                        {department ? `Department: ${department}` : "Select Department"}
                                    </AccordionTrigger>
                                    <AccordionContent style={{ padding: "0 12px 12px" }}>
                                        {departments.map((d) => (
                                            <div
                                                key={d}
                                                style={{ padding: "8px", cursor: "pointer", background: department === d ? "#e2e8f0" : "transparent", borderRadius: "4px" }}
                                                onClick={() => {
                                                    setDepartment(d);
                                                    setOpenAccordion("");
                                                }}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Mobile Department Select */}
                        <div className="mobile-only" style={{ gridColumn: '1 / -1' }}>
                            <select
                                style={{ ...inputStyle, marginBottom: 0, paddingRight: "10px", appearance: "auto", background: "#f8fafc", color: department ? "#000" : "#757575" }}
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="" disabled>Select Department</option>
                                {departments.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Row 3: Password and Confirm Password */}
                        <div style={{ position: "relative", width: '100%' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create Password"
                                style={{ ...inputStyle, marginBottom: 0, paddingRight: "40px", background: "#f8fafc" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? (
                                    <EyeIcon ref={pwEyeRef} size={20} />
                                ) : (
                                    <EyeClosedIcon ref={pwEyeRef} size={20} />
                                )}
                            </button>
                        </div>

                        <div style={{ position: "relative", width: '100%' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                style={{ ...inputStyle, marginBottom: 0, paddingRight: "40px", background: "#f8fafc" }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                title={showConfirmPassword ? "Hide Password" : "Show Password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeIcon ref={confirmPwEyeRef} size={20} />
                                ) : (
                                    <EyeClosedIcon ref={confirmPwEyeRef} size={20} />
                                )}
                            </button>
                        </div>

                        {/* Row 4: Submit Button */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" style={btnStyle}>
                                Register
                            </button>
                        </div>
                    </div>
                </form>

                <p style={backStyle} onClick={() => navigate("/")}>
                    Already have an account? Login
                </p>
            </div>
        </div>
    );
}

export default HodRegister;

/* ---------------- STYLES ---------------- */

const bgStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    padding: "20px",
    position: "relative",
    overflow: "hidden"
};

const cardStyle = {
    maxWidth: "700px",
    width: "100%",
    position: "relative",
    zIndex: 1,
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center"
};

const logoStyle = {
    width: "80px",
    marginBottom: "15px"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#334155"
};

const btnStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#0D9488",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    marginTop: "4px"
};

const backStyle = {
    marginTop: "8px",
    fontSize: "14px",
    color: "#0D9488",
    cursor: "pointer"
};
