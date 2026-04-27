import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../../components/Stepper";

function ApplyLeave() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [eventName, setEventName] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [department, setDepartment] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [generalError, setGeneralError] = useState("");

  const editLeave = location.state?.editLeave || null;
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    if (editLeave) {
      setEventName(editLeave.eventName);
      setCoordinatorName(editLeave.coordinatorName);
      setDepartment(editLeave.department);
      if (editLeave.eventDate) {
        setEventDate(new Date(editLeave.eventDate).toISOString().split('T')[0]);
      }
      setEmail(editLeave.coordinatorEmail);
      setPhone(editLeave.coordinatorPhone);
      setSlots(editLeave.slots);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [editLeave]);

  const SLOT_DEFINITIONS = [
    { id: 1, label: "09:05 – 10:00", section: "MORNING" },
    { id: 2, label: "10:00 – 10:55", section: "MORNING" },
    { id: 3, label: "10:55 – 11:50", section: "MORNING" },
    { id: 4, label: "11:50 – 12:45", section: "MORNING" },
    { id: "break", label: "12:45 – 01:30 (Lunch Break)", section: "LUNCH", blocked: true },
    { id: 5, label: "01:30 – 02:20", section: "EVENING" },
    { id: 6, label: "02:20 – 03:10", section: "EVENING" },
    { id: 7, label: "03:10 – 04:00", section: "EVENING" },
  ];

  const toggleSlot = (slotId) => {
    const slot = SLOT_DEFINITIONS.find(s => s.id === slotId);
    if (slot?.blocked) return;

    setSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(s => s !== slotId)
        : [...prev, slotId]
    );
  };

  const validatePhone = (num) => /^[6-9]\d{9}$/.test(num);
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

  const submitApplication = async () => {
    setLoading(true);
    setGeneralError("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        eventName,
        eventDate,
        coordinatorName,
        coordinatorEmail: email,
        department,
        coordinatorPhone: phone,
        slots
      };
      let res;
      if (editLeave) {
        res = await fetch(`${API_BASE}/api/leave/${editLeave._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/api/leave/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        navigate("/student/dashboard");
      } else {
        const data = await res.json();
        setGeneralError(data.message || "Failed to submit leave application");
      }
    } catch (err) {
      setGeneralError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>{editLeave ? "Edit Duty Leave" : "Apply Duty Leave"}</h2>

      <div style={{
        background: "#fff",
        padding: isMobile ? "20px" : "30px",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        maxWidth: "600px",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Stepper step={step} />

        {/* STEP 1 */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h4 style={{ marginBottom: "10px" }}>Event Details</h4>
            <input
              placeholder="Event Name"
              style={inputStyle}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />

            <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>Coordinator Details</h4>
            <input
              placeholder="Coordinator Name"
              style={inputStyle}
              value={coordinatorName}
              onChange={(e) => setCoordinatorName(e.target.value)}
            />

            <input
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              style={inputStyle}
            />
            {emailError && <p style={errorStyle}>{emailError}</p>}

            <input
              placeholder="Department"
              style={inputStyle}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setPhone(digitsOnly);
                setPhoneError("");
              }}
              maxLength={10}
              style={inputStyle}
            />
            {phoneError && <p style={errorStyle}>{phoneError}</p>}

            {generalError && <p style={errorStyle}>{generalError}</p>}

            <button
              style={btnStyle}
              onClick={() => {
                let valid = true;
                setGeneralError("");

                if (!eventName || !coordinatorName || !department || !email || !phone) {
                  setGeneralError("Please fill in all details first.");
                  valid = false;
                }

                if (!validateEmail(email)) {
                  setEmailError("Enter a valid email address");
                  valid = false;
                }

                if (!validatePhone(phone)) {
                  setPhoneError("Enter valid 10-digit phone number");
                  valid = false;
                }

                if (!valid) return;
                setStep(1);
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h4 style={{ marginBottom: "10px" }}>Event Date</h4>
            <input
              type="date"
              style={inputStyle}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>Select Slots</h4>

            {["MORNING", "LUNCH", "EVENING"].map(section => (
              <div key={section} style={{ marginBottom: "15px" }}>
                <h5 style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "8px",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "4px"
                }}>
                  {section}
                </h5>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {SLOT_DEFINITIONS.filter(s => s.section === section).map(slot => (
                    <label
                      key={slot.id}
                      style={{
                        ...slotBox(slots.includes(slot.id)),
                        opacity: slot.blocked ? 0.6 : 1,
                        cursor: slot.blocked ? "not-allowed" : "pointer",
                        background: slot.blocked ? "#f8fafc" : (slots.includes(slot.id) ? "#CCFBF1" : "#fff"),
                        borderColor: slot.blocked ? "#e2e8f0" : (slots.includes(slot.id) ? "#0D9488" : "#E2E8F0"),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: isMobile ? "calc(50% - 5px)" : "120px",
                        flex: isMobile ? "1 1 auto" : "0 1 auto"
                      }}
                      className="transition-all duration-300"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        disabled={slot.blocked}
                        onChange={() => toggleSlot(slot.id)}
                        checked={slots.includes(slot.id)}
                      />
                      <span style={{ fontSize: "11px", fontWeight: "600" }}>{slot.id === "break" ? "BREAK" : `SLOT ${slot.id}`}</span>
                      <span style={{ fontSize: "12px" }}>{slot.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
              Total Lectures: {slots.length}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ ...btnStyle, background: "#e2e8f0", color: "#334155" }} onClick={() => setStep(0)}>
                Back
              </button>
              <button
                style={btnStyle}
                onClick={() => {
                  if (!eventDate) {
                    setGeneralError("Please select an event date");
                    return;
                  }
                  if (slots.length === 0) {
                    setGeneralError("Please select at least one slot");
                    return;
                  }
                  setGeneralError("");
                  setStep(2);
                }}
              >
                Next
              </button>
            </div>
            {generalError && <p style={{ ...errorStyle, marginTop: "10px" }}>{generalError}</p>}
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: "15px", color: "#0f172a" }}>Confirm Submission</h3>

            <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={detailStyle}><strong>Event:</strong> {eventName}</p>
              <p style={detailStyle}><strong>Date:</strong> {eventDate}</p>
              <p style={detailStyle}><strong>Coordinator:</strong> {coordinatorName} ({department})</p>
              <p style={detailStyle}><strong>Total Slots:</strong> {slots.length} [{slots.sort().join(', ')}]</p>
            </div>

            {generalError && <p style={errorStyle}>{generalError}</p>}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...btnStyle, background: "#e2e8f0", color: "#334155" }}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                style={btnStyle}
                onClick={submitApplication}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "14px"
};

const errorStyle = {
  color: "#EF4444",
  marginTop: "-8px",
  marginBottom: "10px",
  fontSize: "13px"
};

const detailStyle = {
  fontSize: "14px",
  color: "#334155",
  marginBottom: "8px"
}

const btnStyle = {
  marginTop: "10px",
  padding: "12px 24px",
  background: "#0D9488",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  flex: 1,
  transition: "all 0.2s"
};

const slotBox = (active) => ({
  padding: "8px 16px",
  borderRadius: "8px",
  border: `1px solid ${active ? '#0D9488' : '#E2E8F0'}`,
  background: active ? "#CCFBF1" : "#fff",
  color: active ? "#0D9488" : "#64748b",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px",
  transition: "all 0.2s"
});

export default ApplyLeave;