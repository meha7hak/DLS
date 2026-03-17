import { useState } from "react";
import Stepper from "../../components/Stepper";

function ApplyLeave() {

  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const toggleSlot = (slot) => {
    setSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const validatePhone = (num) => /^[6-9]\d{9}$/.test(num);

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

  return (
    <div>

      <h2 style={{ marginBottom: "20px" }}>Apply Duty Leave</h2>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0"
      }}>

        <Stepper step={step} />

        {/* STEP 1 */}
        {step === 0 && (
          <div>

            <input placeholder="Event Name" style={inputStyle} />

            <h4>Coordinator Details</h4>

            <input placeholder="Name" style={inputStyle} />

            {/* EMAIL */}
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              style={inputStyle}
            />

            {emailError && (
              <p style={errorStyle}>{emailError}</p>
            )}

            <input placeholder="Department" style={inputStyle} />

            {/* PHONE */}
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

            {phoneError && (
              <p style={errorStyle}>{phoneError}</p>
            )}

            <button
              style={btnStyle}
              onClick={() => {
                let valid = true;

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
          <div>

            <input type="date" style={inputStyle} />

            <h4>Select Slots</h4>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5, 6, 7].map(slot => (
                <label key={slot} style={slotBox(slots.includes(slot))}>
                  <input
                    type="checkbox"
                    onChange={() => toggleSlot(slot)}
                  />
                  Slot {slot}
                </label>
              ))}
            </div>

            <p style={{ marginTop: "10px" }}>
              Total Lectures: {slots.length}
            </p>

            <button style={btnStyle} onClick={() => setStep(2)}>
              Next
            </button>

          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div>

            <h3>Confirm Submission</h3>

            <p>Total Selected Slots: {slots.length}</p>

            <button style={btnStyle}>Submit</button>

          </div>
        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #E2E8F0",
  borderRadius: "6px"
};

const errorStyle = {
  color: "red",
  marginTop: "-8px",
  marginBottom: "10px",
  fontSize: "14px"
};

const btnStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  background: "#0D9488",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const slotBox = (active) => ({
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #E2E8F0",
  background: active ? "#CCFBF1" : "#fff",
  cursor: "pointer"
});

export default ApplyLeave;