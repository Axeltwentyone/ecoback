import { apiLogout } from "../../../services/api";

const NAV = [
  { id: "overview", icon: "▤", label: "Vue d'ensemble" },
  { id: "users", icon: "◉", label: "Utilisateurs" },
  { id: "espaces", icon: "⬡", label: "Espaces" },
  { id: "equipements", icon: "⊞", label: "Équipements" },
  { id: "reservations", icon: "◷", label: "Réservations" },
];

export default function Sidebar({ active, setActive, isMobile, open, onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await apiLogout();
    localStorage.clear();
    window.location.href = "/login";
  };

  const s = {
    aside: {
      width: 240, background: "#1a3a45", display: "flex", flexDirection: "column", 
      position: "fixed", left: isMobile ? (open ? 0 : -240) : 0, 
      top: 0, bottom: 0, zIndex: 50, transition: "left 0.3s ease"
    },
    header: { padding: "2rem 1.5rem 1.5rem", borderBottom: "1px solid rgba(239,247,246,0.07)", position: 'relative' },
    close: {
      position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', 
      color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: isMobile ? 'block' : 'none'
    }
  };

  return (
    <aside style={s.aside}>
      <div style={s.header}>
        {isMobile && <button onClick={onClose} style={s.close}>×</button>}
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#eff7f6", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>
          Eco<span style={{ color: "#7bdff2" }}>Work</span>
        </div>
        <div style={{ fontSize: "0.65rem", color: "rgba(239,247,246,0.3)", textTransform: "uppercase", letterSpacing: "0.14em" }}>Administration</div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(123,223,242,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 700, color: "#7bdff2" }}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#eff7f6" }}>{user?.prenom} {user?.nom}</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(239,247,246,0.3)" }}>Administrateur</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: "100%", background: "rgba(239,247,246,0.06)", border: "none", color: "rgba(239,247,246,0.4)", padding: "0.55rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
