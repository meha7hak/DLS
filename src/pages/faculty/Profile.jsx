import { useEffect, useState, useRef } from "react";
import { User, Mail, GraduationCap, Building2, BookOpen, Camera, Key, Eye, EyeOff, Briefcase } from "lucide-react";

function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  // Password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserInfo(JSON.parse(data));
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/profile-pic`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserInfo(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // Update local storage
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password updated successfully!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setPasswordMsg({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (err) {
      setPasswordMsg({ type: "error", text: "Server error" });
    } finally {
      setChangingPassword(false);
    }
  };

  if (!userInfo) return <div style={centerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px", alignSelf: "flex-start", width: "100%", maxWidth: "500px" }}>Faculty Profile</h2>
      <div style={cardStyle}>

        {/* PROFILE HEADER START */}
        <div style={headerStyle}>
          <div style={{ position: "relative" }}>
            <div style={avatarStyle}>
              {userInfo.profilePic ? (
                <img src={userInfo.profilePic} alt="Profile" style={imgStyle} />
              ) : (
                <User size={45} color="#2563EB" />
              )}
            </div>
            <button
              style={cameraBtnStyle}
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              title="Upload new photo"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
          {uploading && <p style={{ fontSize: "12px", color: "#64748b", marginTop: "5px" }}>Uploading...</p>}

          <h3 style={nameStyle}>{userInfo.name}</h3>
          <span style={roleStyle}>{userInfo.role}</span>
        </div>
        {/* PROFILE HEADER END */}

        {/* DETAILS GRID START */}
        <div style={gridStyle}>
          {userInfo.email && (
            <div style={detailRowStyle}>
              <div style={iconBoxStyle}><Mail size={18} color="#2563EB" /></div>
              <div>
                <div style={labelStyle}>Email Address</div>
                <div style={valueStyle}>{userInfo.email}</div>
              </div>
            </div>
          )}

          {userInfo.employeeID && (
            <div style={detailRowStyle}>
              <div style={iconBoxStyle}><Briefcase size={18} color="#2563EB" /></div>
              <div>
                <div style={labelStyle}>Employee ID</div>
                <div style={valueStyle}>{userInfo.employeeID}</div>
              </div>
            </div>
          )}

          {userInfo.department && (
            <div style={detailRowStyle}>
              <div style={iconBoxStyle}><Building2 size={18} color="#2563EB" /></div>
              <div>
                <div style={labelStyle}>Branch / Department</div>
                <div style={valueStyle}>{userInfo.department}</div>
              </div>
            </div>
          )}

          {userInfo.semester && (
            <div style={detailRowStyle}>
              <div style={iconBoxStyle}><BookOpen size={18} color="#2563EB" /></div>
              <div>
                <div style={labelStyle}>Class Incharge Of (Semester)</div>
                <div style={valueStyle}>{userInfo.semester}</div>
              </div>
            </div>
          )}
        </div>
        {/* DETAILS GRID END */}

        {/* PASSWORD SECTION */}
        <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          {!showPasswordForm ? (
            <button style={pwBtnStyle} onClick={() => setShowPasswordForm(true)}>
              <Key size={16} />
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="animate-fade-in" style={formStyle}>
              <h4 style={{ marginBottom: "15px", color: "#1e293b" }}>Update Password</h4>

              <div style={{ position: "relative" }}>
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowOld(!showOld)} style={eyeBtnStyle}>
                   {showOld ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} style={eyeBtnStyle}>
                   {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtnStyle}>
                   {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {passwordMsg.text && (
                <p style={{ ...msgStyle, color: passwordMsg.type === 'error' ? 'red' : 'green' }}>
                  {passwordMsg.text}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" style={{ ...submitBtnStyle, background: "#e2e8f0", color: "#334155" }} onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </button>
                <button type="submit" style={submitBtnStyle} disabled={changingPassword}>
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

const centerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" };

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "20px"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "40px",
  border: "1px solid #E2E8F0",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
};

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "30px",
  textAlign: "center"
};

const avatarStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "#DBEAFE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  overflow: "hidden"
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const cameraBtnStyle = {
  position: "absolute",
  bottom: "0px",
  right: "0px",
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
};

const nameStyle = { margin: "15px 0 5px 0", fontSize: "24px", color: "#1e293b" };
const roleStyle = {
  background: "#e2e8f0",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#475569",
  textTransform: "capitalize"
};

const gridStyle = {
  display: "grid",
  gap: "20px"
};

const detailRowStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  paddingBottom: "15px",
  borderBottom: "1px solid #f1f5f9"
};

const iconBoxStyle = {
  background: "#f8fafc",
  padding: "10px",
  borderRadius: "10px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const valueStyle = {
  fontSize: "15px",
  color: "#1e293b",
  fontWeight: 500
};

const pwBtnStyle = {
  width: "100%",
  padding: "12px",
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  boxSizing: "border-box",
  fontSize: "14px"
};

const eyeBtnStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center"
};

const submitBtnStyle = {
  flex: 1,
  padding: "12px",
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};

const msgStyle = {
  fontSize: "13px",
  margin: "0",
  fontWeight: "500"
};

export default Profile;
