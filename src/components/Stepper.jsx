function Stepper({ step }) {
    const steps = ["Event Details", "Date & Slots", "Summary"];
  
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px"
      }}>
        {steps.map((label, index) => (
          <div key={index} style={{ textAlign: "center", flex: 1 }}>
            
            <div style={{
              margin: "auto",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: step >= index ? "#0D9488" : "#E2E8F0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "6px"
            }}>
              {index + 1}
            </div>
  
            <small style={{ color: step >= index ? "#0D9488" : "#64748B" }}>
              {label}
            </small>
  
          </div>
        ))}
      </div>
    );
  }
  
  export default Stepper;