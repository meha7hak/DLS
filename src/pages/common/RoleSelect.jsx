import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import Particles from "../../components/Particles";
import Login from "./Login";

function RoleSelect() {
    const navigate = useNavigate();

    const roles = [
        { name: "Student", path: "/register?role=student" },
        { name: "Teacher", path: "/register?role=teacher" },
        { name: "HOD", path: "/" }
    ];

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#ffffff",
            position: "relative",
            overflow: "hidden",
            padding: "20px",
            boxSizing: "border-box"
        }}>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleColors={["#0D9488"]}
                    particleCount={900}
                    particleSpread={8}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover
                    alphaParticles={false}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>

            <img src={logo} alt="Logo" style={{ maxHeight: "100px", marginBottom: "20px", zIndex: 1, position: "relative" }} />

            <div style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                width: "100%",
                maxWidth: "350px",
                textAlign: "center",
                zIndex: 1,
                position: "relative",
                boxSizing: "border-box"
            }}>

                <h2 style={{ marginBottom: "20px" }}>Select Your Role</h2>

                {roles.map(role => (
                    <button
                        key={role.name}
                        onClick={() => navigate(role.path)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#0D9488",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                    >
                        {role.name}
                    </button>
                ))}

            </div>

        </div>
    );
}

export default RoleSelect;