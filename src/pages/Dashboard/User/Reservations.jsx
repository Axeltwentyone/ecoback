import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Btn from "../components/Btn";
import { apiGetMyReservations, apiDeleteReservation } from "../../../services/api";
import { useLowCarbon } from "../../../context/LowCarbonContext"
import Pagination from "../../../components/Pagination";

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

export default function Reservations() {
  const { lowCarbonMode } = useLowCarbon();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState("Toutes");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const filters = ["Toutes", "À venir", "Passées"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    setLoading(true);
    apiGetMyReservations(page, { 
      date_debut: dateDebut, 
      date_fin: dateFin 
    }).then((res) => {
      if (res?.ok) {
        const list = res.data?.data?.data || res.data?.data || res.data || []
        setReservations(Array.isArray(list) ? list : [])
        setPagination(res.data?.data?.meta || res.data?.pagination || null)
      }
      setLoading(false);
    });
    return () => window.removeEventListener("resize", handleResize);
  }, [dateDebut, dateFin, page]);

  const filtered = reservations.filter((r) => {
      if (filter === "À venir") return new Date(r.date_debut) >= new Date()
      if (filter === "Passées") return new Date(r.date_fin) < new Date()
      return true
  })

  const handleDelete = async () => {
    const res = await apiDeleteReservation(deleteConfirm);
    if (res?.ok) setReservations((prev) => prev.filter((r) => r.id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Mes réservations</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{reservations.length} réservation{reservations.length > 1 ? "s" : ""}</p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              style={{
                padding: "0.4rem 0.6rem", borderRadius: "8px", border: "1px solid rgba(26,58,69,0.12)",
                fontSize: "0.78rem", color: "#1a3a45", fontFamily: "inherit", outline: "none"
              }}
            />
            <span style={{ fontSize: "0.78rem", color: "#4a7a85" }}>au</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              style={{
                padding: "0.4rem 0.6rem", borderRadius: "8px", border: "1px solid rgba(26,58,69,0.12)",
                fontSize: "0.78rem", color: "#1a3a45", fontFamily: "inherit", outline: "none"
              }}
            />
            {(dateDebut || dateFin) && (
              <button
                onClick={() => { setDateDebut(""); setDateFin(""); }}
                style={{
                  background: "none", border: "none", color: "#e53e3e", cursor: "pointer",
                  fontSize: "0.78rem", fontWeight: 600, padding: 0
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "0.5rem 1rem", borderRadius: "8px",
                border: `1px solid ${filter === f ? (lowCarbonMode ? "#0d7a6a" : "#1a3a45") : "rgba(26,58,69,0.12)"}`,
                background: filter === f ? (lowCarbonMode ? "#0d7a6a" : "#1a3a45") : "white",
                color: filter === f ? "#eff7f6" : "#4a7a85",
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", padding: "4rem", textAlign: "center", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📅</div>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem" }}>Aucune réservation dans cette catégorie.</p>
          <a href="/espaces" style={{ textDecoration: "none", background: "#1a3a45", color: "#eff7f6", padding: "0.75rem 1.5rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
            Parcourir les espaces
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {filtered.map((r) => (
            <div key={r.id} style={{
              background: lowCarbonMode ? "#f0f8f5" : "white",
              borderRadius: "16px", padding: "1.3rem 1.5rem",
              boxShadow: lowCarbonMode ? "none" : "0 1px 12px rgba(26,58,69,0.06)",
              border: lowCarbonMode ? "1px solid #d0e8e0" : "none",
              display: "flex", alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between", gap: "1rem",
              flexWrap: "wrap", flexDirection: isMobile ? "column" : "row",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 46, height: 46, borderRadius: "12px", background: TYPE_COLORS[r.espace?.type]?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                  {TYPE_EMOJIS[r.espace?.type]}
                </div>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1a3a45", marginBottom: "0.2rem" }}>{r.espace?.nom}</div>
                  <div style={{ fontSize: "0.75rem", color: "#4a7a85" }}>{r.date_debut} → {r.date_fin}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a3a45" }}>{Number(r.prix).toLocaleString("fr-FR")} €</div>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "100px",
                    background: r.facture_acquittee ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                    color: r.facture_acquittee ? "#16a34a" : "#d97706",
                  }}>
                    {r.facture_acquittee ? "✓ Payée" : "En attente"}
                  </span>
                </div>
                {!r.facture_acquittee && (
                  <Btn size="sm" variant="danger" onClick={() => setDeleteConfirm(r.id)}>Annuler</Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} page={page} onPage={setPage} />

      {deleteConfirm && (
        <Modal title="Annuler la réservation ?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Cette réservation sera annulée définitivement. Cette action est irréversible.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)}>Garder</Btn>
            <Btn variant="danger" onClick={handleDelete}>Confirmer l'annulation</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}