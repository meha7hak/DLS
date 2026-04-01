import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";

function ApplyLeave() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [eventName, setEventName] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [department, setDepartment] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [generalError, setGeneralError] = useState("");

  const toggleSlot = (slot) => {
    setSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
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
      
      const res = await fetch("/api/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
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
      <h2 style={{ marginBottom: "20px" }}>Apply Duty Leave</h2>

      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        maxWidth: "600px"
      }}>
        <Stepper step={step} />

        {/* STEP 1 */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h4 style={{marginBottom: "10px"}}>Event Details</h4>
            <input 
              placeholder="Event Name" 
              style={inputStyle} 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />

            <h4 style={{marginTop: "15px", marginBottom: "10px"}}>Coordinator Details</h4>
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
            <h4 style={{marginBottom: "10px"}}>Event Date</h4>
            <input 
              type="date" 
              style={inputStyle} 
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <h4 style={{marginTop: "15px", marginBottom: "10px"}}>Select Slots</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
              {[1, 2, 3, 4, 5, 6, 7].map(slot => (
                <label key={slot} style={slotBox(slots.includes(slot))} className="transition-all duration-300">
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={() => toggleSlot(slot)}
                  />
                  Slot {slot}
                </label>
              ))}
            </div>

            <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
              Total Lectures: {slots.length}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{...btnStyle, background: "#e2e8f0", color: "#334155"}} onClick={() => setStep(0)}>
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
            {generalError && <p style={{...errorStyle, marginTop: "10px"}}>{generalError}</p>}
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
              <p style={detailStyle}><strong>Total Slots:</strong> {slots.length} [{slots.join(', ')}]</p>
            </div>

            {generalError && <p style={errorStyle}>{generalError}</p>}

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                style={{...btnStyle, background: "#e2e8f0", color: "#334155"}} 
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