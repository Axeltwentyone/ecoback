export default function Btn({ children, onClick, variant = "primary", size = "md", disabled }) {
  const styles = {
    primary: { background: "#1a3a45", color: "#eff7f6" },
    cyan: { background: "#7bdff2", color: "#1a3a45" },
    ghost: { background: "transparent", color: "#4a7a85", border: "1px solid rgba(26,58,69,0.15)" },
    danger: { background: "rgba(248,113,113,0.08)", color: "#ef4444", border: "1px solid rgba(248,113,113,0.2)" },
  };
  const sizes = { sm: "0.4rem 0.8rem", md: "0.7rem 1.3rem", lg: "1rem 2rem" };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: sizes[size],
      borderRadius: "8px",
      border: styles[variant].border || "none",
      fontSize: size === "sm" ? "0.75rem" : "0.85rem",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s",
      fontFamily: "inherit",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      whiteSpace: "nowrap",
    }}>
      {children}
    </button>
  );
}
