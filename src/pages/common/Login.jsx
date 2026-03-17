import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import Particles from "../../components/Particles";

function Login() {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState("student"); // 'student' or 'staff'

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
                        style={loginType === 'student' ? activeToggleStyle : inactiveToggleStyle}
                        onClick={() => setLoginType('student')}
                    >
                        Student
                    </button>
                    <button 
                        style={loginType === 'staff' ? activeToggleStyle : inactiveToggleStyle}
                        onClick={() => setLoginType('staff')}
                    >
                        Teacher / HOD
                    </button>
                </div>

                {loginType === 'student' ? (
                    <input placeholder="University Roll No" style={inputStyle} />
                ) : (
                    <input placeholder="Email Address" type="email" style={inputStyle} />
                )}

                <input
                    type="password"
                    placeholder="Password"
                    style={inputStyle}
                />

                <button style={btnStyle} onClick={() => navigate("/student/dashboard")}>
                    Login
                </button>

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
    maxWidth: "340px"
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