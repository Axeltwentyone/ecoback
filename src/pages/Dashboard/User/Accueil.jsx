import { useState, useEffect } from "react";
import { apiGetMyReservations } from "../../../services/api";
import { useLowCarbon } from "../../../context/LowCarbonContext"

const TYPE_COLORS = {
  bureau: { bg: "#e8faf8" },
  salle_reunion: { bg: "#e0f6fb" },
  conference: { bg: "#fdf0f4" },
};

const TYPE_EMOJIS = {
  bureau: "🖥️",
  salle_reunion: "📽️",
  conference: "🎤",
};

export default function Accueil({ setActive }) {
  const { lowCarbonMode } = useLowCarbon();
  const user = JSON.parse(localStorage.getItem("user"));
  const [reservations, setReservations] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    apiGetMyReservations().then((res) => {
      if (res?.ok) {
        const list = res.data?.data?.data || res.data?.data || res.data || []
        setReservations(Array.isArray(list) ? list : []);
      }
    });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const upcoming = reservations.filter((r) => !r.facture_acquittee);
  const totalDepense = reservations
    .filter(r => r.facture_acquittee)
    .reduce((sum, r) => sum + Number(r.prix), 0)

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>

      {lowCarbonMode && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1rem", background: "#e8faf8", border: "1px solid #b2e8de", borderRadius: "10px", marginBottom: "1.2rem" }}>
          <span>🌿</span>
          <span style={{ fontSize: "0.8rem", color: "#0d7a6a", fontWeight: 500 }}>Mode Low Carbon actif — images et animations réduites.</span>
        </div>
      )}

      <div style={{
        background: lowCarbonMode ? "#e8f4f0" : "#1a3a45",
        borderRadius: "20px",
        padding: isMobile ? "1.5rem" : "2.5rem",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {!lowCarbonMode && (
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(123,223,242,0.07)", pointerEvents: "none" }} />
        )}
        <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: lowCarbonMode ? "#0d7a6a" : "#7bdff2", marginBottom: "0.6rem" }}>
          {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 300, color: lowCarbonMode ? "#1a3a45" : "#eff7f6", lineHeight: 1.2, marginBottom: "1.8rem" }}>
          {greeting},<br />
          <span style={{ fontWeight: 700 }}>{user?.prenom}.</span>
        </h2>
        <a href="/espaces" style={{
          textDecoration: "none",
          background: lowCarbonMode ? "#0d7a6a" : "#7bdff2",
          color: lowCarbonMode ? "#fff" : "#1a3a45",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: 700,
          display: "inline-block",
        }}>
          Réserver un espace →
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Réservations totales", val: reservations.length, icon: "📅" },
          { label: "En attente de paiement", val: upcoming.length, icon: "⏳" },
          { label: "Total dépensé", val: `${totalDepense.toLocaleString("fr-FR")} €`, icon: "💶" },
        ].map((s, i) => (
          <div key={i} style={{
            background: lowCarbonMode ? "#f0f8f5" : "white",
            borderRadius: "14px", padding: "1.3rem",
            boxShadow: lowCarbonMode ? "none" : "0 1px 12px rgba(26,58,69,0.06)",
            border: lowCarbonMode ? "1px solid #d0e8e0" : "none",
            display: "flex", gap: "1rem", alignItems: "center",
          }}>
            <div style={{ width: 38, height: 38, borderRadius: "10px", background: "#f0f4f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: "0.72rem", color: "#4a7a85", marginTop: "0.2rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div style={{ background: lowCarbonMode ? "#f0f8f5" : "white", borderRadius: "16px", padding: "1.5rem", boxShadow: lowCarbonMode ? "none" : "0 1px 12px rgba(26,58,69,0.06)", border: lowCarbonMode ? "1px solid #d0e8e0" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a3a45" }}>Réservations en attente</h3>
            <button onClick={() => setActive("reservations")} style={{ background: "none", border: "none", fontSize: "0.78rem", color: "#4a7a85", cursor: "pointer", fontFamily: "inherit" }}>
              Voir tout →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {upcoming.slice(0, 3).map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.8rem", background: "#f8fbfc", borderRadius: "10px" }}>
                <div style={{ width: 38, height: 38, borderRadius: "10px", background: TYPE_COLORS[r.espace?.type]?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                  {TYPE_EMOJIS[r.espace?.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a3a45" }}>{r.espace?.nom}</div>
                  <div style={{ fontSize: "0.72rem", color: "#4a7a85" }}>{r.date_debut} → {r.date_fin}</div>
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1a3a45" }}>{r.prix} € </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}