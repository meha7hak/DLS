import { useEffect, useState } from "react";
import { User, Mail, Building2, Briefcase } from "lucide-react";

function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserInfo(JSON.parse(data));
    }
  }, []);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>HOD Profile</h2>
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "30px",
        border: "1px solid #E2E8F0",
        maxWidth: "600px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            background: "#FEE2E2", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#DC2626"
          }}>
            <User size={40} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "24px", color: "#1e293b" }}>{userInfo.name}</h3>
            <span style={{ 
              background: "#e2e8f0", 
              padding: "4px 10px", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: 600,
              color: "#475569",
              textTransform: "capitalize" 
            }}>
              {userInfo.role}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {userInfo.email && (
            <div style={detailRowStyle}>
              <Mail size={18} color="#64748b" />
              <div>
                <div style={labelStyle}>Email Address</div>
                <div style={valueStyle}>{userInfo.email}</div>
              </div>
            </div>
          )}

          {userInfo.employeeID && (
            <div style={detailRowStyle}>
              <Briefcase size={18} color="#64748b" />
              <div>
                <div style={labelStyle}>Employee ID</div>
                <div style={valueStyle}>{userInfo.employeeID}</div>
              </div>
            </div>
          )}

          {userInfo.department && (
            <div style={detailRowStyle}>
              <Building2 size={18} color="#64748b" />
              <div>
                <div style={labelStyle}>Department</div>
                <div style={valueStyle}>{userInfo.department}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const detailRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  paddingBottom: "15px",
  borderBottom: "1px solid #f1f5f9"
};

const labelStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "4px"
};

const valueStyle = {
  fontSize: "15px",
  color: "#1e293b",
  fontWeight: 500
};

export default Profile;
