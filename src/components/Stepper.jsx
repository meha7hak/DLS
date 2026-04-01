function Stepper({ step }) {
    const steps = ["Event Details", "Date & Slots", "Summary"];
  
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px",
        position: "relative"
      }}>
        {steps.map((label, index) => {
          const isActive = step >= index;
          const isCurrent = step === index;
          
          return (
            <div key={index} style={{ textAlign: "center", flex: 1, zIndex: 1 }}>
              <div style={{
                margin: "auto",
                width: isCurrent ? "40px" : "35px",
                height: isCurrent ? "40px" : "35px",
                borderRadius: "50%",
                background: isActive ? "#0D9488" : "#E2E8F0",
                color: isActive ? "#fff" : "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: isCurrent ? "scale(1.1)" : "scale(1)",
                boxShadow: isActive ? "0 4px 6px -1px rgba(13, 148, 136, 0.3)" : "none"
              }}>
                {index + 1}
              </div>
    
              <small style={{ 
                color: isActive ? "#0D9488" : "#64748B",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.3s ease"
              }}>
                {label}
              </small>
            </div>
          );
        })}
      </div>
    );
  }
  
  export default Stepper;