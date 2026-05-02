export default function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,20,22,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "white", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: 500, boxShadow: "0 30px 80px rgba(10,20,22,0.25)", animation: "fadeIn 0.25s ease", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.02em" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a7a85", fontSize: "1.3rem", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
