function Stepper({ step }) {
    const steps = ["Event Details", "Date & Slots", "Summary"];
  
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px",
        position: "relative",
        padding: "0 10px"
      }}>
        {/* Background Line */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: `${100 / (steps.length * 2)}%`,
          right: `${100 / (steps.length * 2)}%`,
          height: "2px",
          background: "#E2E8F0",
          zIndex: 0
        }} />
        
        {/* Progress Line */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: `${100 / (steps.length * 2)}%`,
          width: `${(step / (steps.length - 1)) * (100 - (100 / steps.length))}%`,
          height: "2px",
          background: "#0D9488",
          zIndex: 0,
          transition: "width 0.3s ease"
        }} />

        {steps.map((label, index) => {
          const isActive = step >= index;
          const isCurrent = step === index;
          const isCompleted = step > index;
          
          return (
            <div key={index} style={{ textAlign: "center", flex: 1, zIndex: 1, position: "relative" }}>
              <div style={{
                margin: "auto",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: isActive ? "#0D9488" : "#fff",
                border: `2px solid ${isActive ? '#0D9488' : '#E2E8F0'}`,
                color: isActive ? "#fff" : "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                // Delay the "pop" for the current/next step to match the line transition
                transitionDelay: isCurrent && step > 0 ? "0.2s" : "0s",
                transform: isCurrent ? "scale(1.1)" : "scale(1)",
                boxShadow: isActive ? "0 4px 6px -1px rgba(13, 148, 136, 0.3)" : "none"
              }}>
                {index + 1}
              </div>
    
              <small style={{ 
                color: isActive ? "#0D9488" : "#64748B",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.3s ease",
                transitionDelay: isCurrent && step > 0 ? "0.2s" : "0s",
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