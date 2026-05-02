import { useState } from "react";

export default function Input({ label, value, onChange, type = "text", placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {label && (
        <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {label}
        </label>
      )}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: disabled ? "#f8fbfc" : "white",
          border: `1px solid ${focused ? "rgba(123,223,242,0.6)" : "rgba(26,58,69,0.1)"}`,
          borderRadius: "8px", padding: "0.75rem 1rem",
          color: disabled ? "#4a7a85" : "#1a3a45",
          fontSize: "0.88rem", transition: "border-color 0.2s",
          width: "100%", cursor: disabled ? "not-allowed" : "text",
          fontFamily: "inherit", outline: "none",
        }}
      />
    </div>
  );
}
