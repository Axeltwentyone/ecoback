import { useState, useEffect } from "react";
import { apiGetReservations } from "../../../services/api";

function StatCard({ icon, label, value, sub, color = "#7bdff2" }) {
  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", boxShadow: "0 1px 12px rgba(26,58,69,0.06)", animation: "fadeIn 0.5s ease both" }}>
      <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.78rem", color: "#4a7a85", marginTop: "0.3rem" }}>{label}</div>
      </div>
      {sub && <div style={{ fontSize: "0.72rem", color, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

export default function Overview({ usersCount, espacesCount }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchReservations = async () => {
    try {
      const res = await apiGetReservations();
      
      // Extraction robuste pour supporter la pagination (data.data.data) ou format direct (data.data)
      const list = res.data?.data?.data || res.data?.data || res.data || [];
      setReservations(list);
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    fetchReservations();

    // Auto-refresh toutes les 30 secondes pour les revenus et stats
    const interval = setInterval(fetchReservations, 30000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [refreshKey]);

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const safeReservations = Array.isArray(reservations) ? reservations : [];
  const revenus = safeReservations
    .filter(r => r?.facture_acquittee)
    .reduce((acc, r) => acc + (Number(r?.prix) || 0), 0);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Vue d'ensemble</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <button 
          onClick={() => setRefreshKey(prev => prev + 1)}
          style={{ background: "white", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          title="Rafraîchir les statistiques"
        >
          🔄
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard icon="👤" label="Utilisateurs" value={usersCount} sub="↑ +2 ce mois" color="#7bdff2" />
        <StatCard icon="🏢" label="Espaces" value={espacesCount} sub="Tous opérationnels" color="#b2f7ef" />
        <StatCard icon="📅" label="Réservations" value={safeReservations.length} sub="Toutes périodes" color="#f7d6e0" />
        <StatCard icon="💶" label="Revenus cumulés" value={`${revenus.toLocaleString('fr-FR')}€`} sub="Factures acquittées" color="#7bdff2" />
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 1px 12px rgba(26,58,69,0.06)", overflowX: "auto" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a3a45", marginBottom: "1.2rem" }}>Dernières réservations</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr>
              {["Utilisateur", "Espace", "Dates", "Montant", "Statut"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0 0.8rem", borderBottom: "1px solid rgba(26,58,69,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeReservations.slice(0, 5).map((r, i) => (
              <tr key={r?.id ? `res-${r.id}` : `idx-${i}`} style={{ borderBottom: i < Math.min(safeReservations.length, 5) - 1 ? "1px solid rgba(26,58,69,0.04)" : "none" }}>
                <td style={{ padding: "0.9rem 0", fontSize: "0.85rem", fontWeight: 500, color: "#1a3a45" }}>{r?.user?.prenom} {r?.user?.nom}</td>
                <td style={{ padding: "0.9rem 0", fontSize: "0.85rem", color: "#4a7a85" }}>{r?.espace?.nom}</td>
                <td style={{ padding: "0.9rem 0", fontSize: "0.82rem", color: "#4a7a85" }}>{r?.date_debut} → {r?.date_fin}</td>
                <td style={{ padding: "0.9rem 0", fontSize: "0.85rem", fontWeight: 600, color: "#1a3a45" }}>{Number(r?.prix).toLocaleString('fr-FR')}€</td>
                <td style={{ padding: "0.9rem 0" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.7rem", borderRadius: "100px", background: r?.facture_acquittee ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)", color: r?.facture_acquittee ? "#16a34a" : "#d97706" }}>
                    {r?.facture_acquittee ? "✓ Payée" : "En attente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
