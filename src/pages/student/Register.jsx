import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';

    // Shared Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Student Specific States
    const [rollNo, setRollNo] = useState("");
    const [branch, setBranch] = useState("");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    
    // Teacher Specific States
    const [inchargeClass, setInchargeClass] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    // Password Visibility States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Refs for animated icons
    const pwEyeRef = useRef(null);
    const confirmPwEyeRef = useRef(null);

    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Basic shared validation
        if (!name || !email || !password || !confirmPassword) {
            setErrorMsg("Please fill in all core fields.");
            return;
        }

        // Role specific validation
        if (role === 'student' && (!rollNo || !branch || !course || !semester)) {
            setErrorMsg("Please fill all student details.");
            return;
        }

        if (role === 'teacher' && !inchargeClass) {
            setErrorMsg("Please select the class you are incharge of.");
            return;
        }

        // Password validation
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        // Proceed to register (mock)
        navigate("/");
    };

    const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const branches = ["CSE"];

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
            <div style={cardStyle}>
                <img src={logo} alt="Logo" style={logoStyle} />
                <h2 style={{ marginBottom: "20px", textTransform: "capitalize" }}>Register As {role}</h2>

                {errorMsg && <p style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>{errorMsg}</p>}

                <form onSubmit={handleRegister}>
                    {/* GRID LAYOUT START */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

                        {/* ROW 1: Shared Name and conditional second column */}
                        <div style={{width: '100%'}}>
                            <input 
                                placeholder="Full Name" 
                                style={{...inputStyle, marginBottom: 0}} 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {role === 'student' ? (
                            <div style={{width: '100%'}}>
                                <input 
                                    placeholder="University Roll No" 
                                    style={{...inputStyle, marginBottom: 0}} 
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div style={{width: '100%'}}>
                                <input 
                                    placeholder="Email Address" 
                                    type="email" 
                                    style={{...inputStyle, marginBottom: 0}} 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {/* ROW 2: Email and Course for Student, Incharge for Teacher */}
                        {role === 'student' ? (
                            <>
                                <div style={{width: '100%'}}>
                                    <input 
                                        placeholder="Email Address" 
                                        type="email" 
                                        style={{...inputStyle, marginBottom: 0}} 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div style={{width: '100%'}}>
                                    <input 
                                        placeholder="Course" 
                                        style={{...inputStyle, marginBottom: 0}} 
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Teacher Row 2: Incharge Accordion */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Accordion type="single" collapsible style={{ textAlign: "left", background: "#f8fafc", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                                        <AccordionItem value="incharge" style={{ borderBottom: "none" }}>
                                            <AccordionTrigger style={{ padding: "12px", fontSize: "14px", color: inchargeClass ? "#000" : "#757575" }}>
                                                {inchargeClass ? `Class Incharge of: Semester ${inchargeClass}` : "Class Incharge of ? (Select Semester)"}
                                            </AccordionTrigger>
                                            <AccordionContent style={{ padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                                                {semesters.map((s) => (
                                                    <div 
                                                        key={s} 
                                                        style={{ padding: "8px", cursor: "pointer", textAlign: "center", background: inchargeClass === s ? "#e2e8f0" : "transparent", borderRadius: "4px" }}
                                                        onClick={() => setInchargeClass(s)}
                                                    >
                                                        Semester {s}
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </>
                        )}

                        {/* ROW 3: Branch and Semester for Student */}
                        {role === 'student' && (
                            <>
                                <div style={{width: '100%'}}>
                                    <Accordion type="single" collapsible style={{ textAlign: "left", background: "#f8fafc", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                                        <AccordionItem value="branch" style={{ borderBottom: "none" }}>
                                            <AccordionTrigger style={{ padding: "12px", fontSize: "14px", color: branch ? "#000" : "#757575" }}>
                                                {branch ? `Branch: ${branch}` : "Select Branch"}
                                            </AccordionTrigger>
                                            <AccordionContent style={{ padding: "0 12px 12px" }}>
                                                {branches.map((b) => (
                                                    <div 
                                                        key={b} 
                                                        style={{ padding: "8px", cursor: "pointer", background: branch === b ? "#e2e8f0" : "transparent", borderRadius: "4px" }}
                                                        onClick={() => setBranch(b)}
                                                    >
                                                        {b}
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                                <div style={{width: '100%'}}>
                                    <Accordion type="single" collapsible style={{ textAlign: "left", background: "#f8fafc", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                                        <AccordionItem value="semester" style={{ borderBottom: "none" }}>
                                            <AccordionTrigger style={{ padding: "12px", fontSize: "14px", color: semester ? "#000" : "#757575" }}>
                                                {semester ? `Semester: ${semester}` : "Select Semester"}
                                            </AccordionTrigger>
                                            <AccordionContent style={{ padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                                                {semesters.map((s) => (
                                                    <div 
                                                        key={s} 
                                                        style={{ padding: "8px", cursor: "pointer", textAlign: "center", background: semester === s ? "#e2e8f0" : "transparent", borderRadius: "4px" }}
                                                        onClick={() => setSemester(s)}
                                                    >
                                                        Semester {s}
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </>
                        )}

                        {/* ROW 4/Shared: Passwords */}
                        <div style={{ position: "relative", width: '100%' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create Password"
                                style={{...inputStyle, marginBottom: 0, paddingRight: "40px", background: "#f8fafc"}}
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
                                style={{...inputStyle, marginBottom: 0, paddingRight: "40px", background: "#f8fafc"}}
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

                        {/* ROW 5: Submit Button spanning 2 columns */}
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

export default Register;

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
    background: "rgba(255,255,255,0.95)",
    padding: "40px",
    borderRadius: "16px",
    width: "700px",
    maxWidth: "90%",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    position: "relative",
    zIndex: 1
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
