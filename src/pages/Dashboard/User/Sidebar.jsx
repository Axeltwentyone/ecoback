import { useLowCarbon } from "../../../context/LowCarbonContext"
import LowCarbonToggle from "../../../components/LowCarbonToggle";

const NAV = [
  { id: "accueil", icon: "◈", label: "Accueil" },
  { id: "reservations", icon: "◷", label: "Mes réservations" },
  { id: "profil", icon: "◉", label: "Mon profil" },
];

export default function Sidebar({ active, setActive, isMobile, open, onClose }) {
  const { lowCarbonMode } = useLowCarbon();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside style={{
      width: 230,
      background: lowCarbonMode ? "#1e4a55" : "#1a3a45",
      display: "flex", flexDirection: "column",
      position: "fixed", left: isMobile ? (open ? 0 : -230) : 0,
      top: 0, bottom: 0, zIndex: 50,
      transition: "left 0.3s ease",
    }}>
      <div style={{ padding: "2rem 1.5rem 1.5rem", borderBottom: "1px solid rgba(239,247,246,0.07)", position: "relative" }}>
        {isMobile && (
          <button onClick={onClose} style={{ position: "absolute", right: "1rem", top: "1rem", background: "none", border: "none", color: "#fff", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
        )}
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#eff7f6", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>
          Eco<span style={{ color: lowCarbonMode ? "#5eead4" : "#7bdff2" }}>Work</span>
        </div>
        <div style={{ fontSize: "0.65rem", color: "rgba(239,247,246,0.3)", textTransform: "uppercase", letterSpacing: "0.14em" }}>Espace membre</div>
      </div>

      <nav style={{ padding: "1rem 0.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: "0.85rem",
            padding: "0.75rem 0.9rem", borderRadius: "10px",
            background: active === item.id ? "rgba(123,223,242,0.1)" : "transparent",
            border: "none", cursor: "pointer",
            color: active === item.id ? "#7bdff2" : "rgba(239,247,246,0.4)",
            fontSize: "0.85rem", fontWeight: active === item.id ? 600 : 400,
            transition: "all 0.2s", fontFamily: "inherit", textAlign: "left", width: "100%",
            borderLeft: `2px solid ${active === item.id ? "#7bdff2" : "transparent"}`,
          }}>
            <span style={{ fontSize: "0.95rem" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid rgba(239,247,246,0.07)" }}>
        <div style={{ marginBottom: "0.8rem" }}>
          <LowCarbonToggle dark />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(247,214,224,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 700, color: "#f7d6e0" }}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#eff7f6" }}>{user?.prenom} {user?.nom}</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(239,247,246,0.3)" }}>Membre</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: "100%", background: "rgba(239,247,246,0.06)", border: "none", color: "rgba(239,247,246,0.4)", padding: "0.55rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}