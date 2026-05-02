import { useState, useEffect } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { apiGetEquipements, apiCreateEquipement, apiUpdateEquipement, apiDeleteEquipement } from "../../../services/api";

export default function Equipements() {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLibelle, setNewLibelle] = useState("");
  const [editEq, setEditEq] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchEquipements = async () => {
  try {
    const res = await apiGetEquipements();

    if (res.ok) {
      const list = res.data?.data?.data || res.data?.data || res.data || [];
      setEquipements(Array.isArray(list) ? list : []);
    } else {
      setError("Erreur lors de la récupération des équipements.");
    }
  } catch (err) {
    setError("Une erreur s'est produite. Veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};
    fetchEquipements();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreate = async () => {
    if (!newLibelle.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiCreateEquipement({ libelle: newLibelle.trim() });
      if (res.ok) {
        setEquipements(e => Array.isArray(e) ? [...e, res.data.data] : [res.data.data]);
        setNewLibelle("");
      } else {
        setError("Erreur lors de la création de l'équipement.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiDeleteEquipement(id);
      if (res.ok) {
        setEquipements(e => Array.isArray(e) ? e.filter(x => x.id !== id) : []);
      } else {
        setError("Erreur lors de la suppression de l'équipement.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiUpdateEquipement(editEq.id, { libelle: editEq.libelle });
      if (res.ok) {
        setEquipements(e => Array.isArray(e) ? e.map(x => x.id === editEq.id ? res.data.data : x) : [res.data.data]);
        setEditEq(null);
      } else {
        setError("Erreur lors de la mise à jour de l'équipement.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const safeEquipements = Array.isArray(equipements) ? equipements : [];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Équipements</h2>
        <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{safeEquipements.length} équipements disponibles</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: "1.5rem", alignItems: "start" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a3a45", marginBottom: "1.2rem" }}>Ajouter</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <Input label="Libellé" value={newLibelle} onChange={e => setNewLibelle(e.target.value)} placeholder="Ex: Vidéoprojecteur" disabled={isSubmitting} />
            <Btn variant="cyan" onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </Btn>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(26,58,69,0.05)", fontSize: "0.82rem", fontWeight: 600, color: "#4a7a85" }}>
            Liste des équipements
          </div>
          {safeEquipements.map((eq, i) => (
            <div key={`eq-${eq.id ?? i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.5rem", borderBottom: i < safeEquipements.length - 1 ? "1px solid rgba(26,58,69,0.04)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7bdff2" }} />
                <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "#1a3a45" }}>{eq.libelle}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Btn size="sm" variant="ghost" onClick={() => setEditEq({ ...eq })} disabled={isSubmitting}>Modifier</Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(eq.id)} disabled={isSubmitting}>×</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editEq && (
        <Modal title="Modifier l'équipement" onClose={() => setEditEq(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Libellé" value={editEq.libelle} onChange={e => setEditEq(eq => ({ ...eq, libelle: e.target.value }))} disabled={isSubmitting} />
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setEditEq(null)} disabled={isSubmitting}>Annuler</Btn>
              <Btn variant="cyan" onClick={handleUpdate} disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
