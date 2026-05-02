import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Accueil from "./Accueil";
import Reservations from "./Reservations";
import Profil from "./Profil";
import { useLowCarbon } from "../../../context/LowCarbonContext"

export default function UserDashboard() {
  const { lowCarbonMode } = useLowCarbon();
  const [active, setActive] = useState("accueil");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = {
    accueil: <Accueil setActive={setActive} />,
    reservations: <Reservations />,
    profil: <Profil />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: lowCarbonMode ? "#f7f7f7" : "#f0f4f5", transition: "background 0.3s" }}>
      <Sidebar
        active={active}
        setActive={(id) => { setActive(id); setSidebarOpen(false); }}
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }} />
      )}

      <main style={{ marginLeft: isMobile ? 0 : 230, flex: 1, padding: isMobile ? "1rem" : "2.5rem", minHeight: "100vh", width: "100%", transition: "margin 0.3s" }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "white", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#1a3a45", fontFamily: "inherit" }}
          >
            ☰ Menu
          </button>
        )}
        {sections[active]}
      </main>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
}