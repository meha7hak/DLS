import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "../../components/ui/eye";
import { EyeClosedIcon } from "../../components/ui/eye-closed";
import logo from "../../assets/Logo.png";
import Particles from "../../components/Particles";

function Login() {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState("student"); // 'student' or 'staff'

    // Auth States
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Password Visibility State
    const [showPassword, setShowPassword] = useState(false);
    const pwEyeRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!identifier || !password) {
            setErrorMsg("Please enter both ID/Email and password.");
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password, role: loginType })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userInfo", JSON.stringify(data));

                // Redirect user based on their role setup
                if (data.role === 'faculty' || data.role === 'teacher') {
                    navigate("/faculty/dashboard");
                } else if (data.role === 'hod') {
                    navigate("/hod/dashboard");
                } else {
                    navigate("/student/dashboard");
                }
            } else {
                setErrorMsg(data.message || "Invalid credentials");
            }
        } catch (err) {
            setErrorMsg("Server error. Please try again later.");
        }
    };

    return (
        <div style={bgStyle}>
            {/* BACKGROUND ANIMATION */}
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

            {/* CARD */}
            <div className="auth-card" style={cardStyle}>

                <img src={logo} alt="logo" style={logoStyle} />

                <h2 style={{ marginBottom: "20px" }}>Login</h2>

                {/* ROLE TOGGLE */}
                <div style={toggleContainerStyle}>
                    <button
                        type="button"
                        style={loginType === 'student' ? activeToggleStyle : inactiveToggleStyle}
                        onClick={() => { setLoginType('student'); setIdentifier(""); }}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        style={loginType === 'staff' ? activeToggleStyle : inactiveToggleStyle}
                        onClick={() => { setLoginType('staff'); setIdentifier(""); }}
                    >
                        Teacher / HOD
                    </button>
                </div>

                {errorMsg && <p style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>{errorMsg}</p>}

                <form onSubmit={handleLogin}>
                    {loginType === 'student' ? (
                        <input
                            placeholder="University Roll No"
                            style={inputStyle}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    ) : (
                        <input
                            placeholder="Email Address"
                            type="email"
                            style={inputStyle}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    )}

                    <div style={{ position: "relative", width: '100%' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            style={{ ...inputStyle, paddingRight: "40px" }}
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

                    <button type="submit" style={btnStyle}>
                        Login
                    </button>
                </form>

                <p
                    style={backStyle}
                    onClick={() => navigate("/role-select")}
                >
                    Don't have an account? Register
                </p>

            </div>

        </div>
    );
}

export default Login;

/* ---------------- STYLES ---------------- */

const bgStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a", // Dark background so white particles are visible
    position: "relative",
    overflow: "hidden",
    padding: "20px",
    boxSizing: "border-box"
};

const cardStyle = {
    maxWidth: "340px",
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
    width: "70px",
    marginBottom: "15px"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    boxSizing: "border-box"
};

const btnStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#0D9488",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px"
};

const backStyle = {
    marginTop: "15px",
    fontSize: "14px",
    color: "#0D9488",
    cursor: "pointer"
};

const toggleContainerStyle = {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "20px"
};

const activeToggleStyle = {
    flex: 1,
    padding: "8px",
    background: "#fff",
    border: "none",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    fontWeight: "600",
    color: "#0D9488",
    cursor: "pointer",
    fontSize: "14px"
};

const inactiveToggleStyle = {
    flex: 1,
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px"
};