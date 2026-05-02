import { useState, useEffect } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { apiGetEspaces, apiAdminGetEspaces, apiGetEquipements, apiCreateEspace, apiUpdateEspace, apiDeleteEspace, API_URL } from "../../../services/api";
import Pagination from "../../../components/Pagination";

const TYPE_LABELS = { bureau: "Bureau", salle_reunion: "Réunion", conference: "Conférence" };
const TYPE_COLORS = {
  bureau: { bg: "#e8faf8", text: "#0a6b5c" },
  salle_reunion: { bg: "#e0f6fb", text: "#0a5a6b" },
  conference: { bg: "#fdf0f4", text: "#6b0a2a" },
};

function Badge({ type }) {
  const c = TYPE_COLORS[type] || { bg: "#f0f4f5", text: "#4a7a85" };
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.7rem", borderRadius: "100px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

const toggleEquip = (setData, eq) => {
  setData(d => {
    const current = Array.isArray(d.equipements) ? d.equipements : [];
    const has = current.some(e => (e.id || e) == eq.id);
    return {
      ...d,
      equipements: has 
        ? current.filter(e => (e.id || e) != eq.id) 
        : [...current, eq]
    };
  });
};

const EspaceForm = ({ data, setData, onSave, onCancel, title, equipements, isSubmitting }) => {
  const isMobile = window.innerWidth < 768;
  return (
    <Modal title={title} onClose={onCancel}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
          <Input label="Nom" value={data?.nom || ""} onChange={e => setData(d => ({ ...d, nom: e.target.value }))} placeholder="Ex: Bureau Calme A" disabled={isSubmitting} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setData(d => ({ ...d, photoFile: e.target.files[0] }))}
              disabled={isSubmitting}
              style={{ fontSize: "0.85rem", color: "#4a7a85" }}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</label>
            <select value={data?.type || "bureau"} onChange={e => setData(d => ({ ...d, type: e.target.value }))} disabled={isSubmitting}
              style={{ background: "#f8fbfc", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#1a3a45", fontSize: "0.88rem", fontFamily: "inherit", outline: "none" }}>
              <option value="bureau">Bureau</option>
              <option value="salle_reunion">Salle de réunion</option>
              <option value="conference">Conférence</option>
            </select>
          </div>
          <Input label="Surface (m²)" type="number" value={data?.surface || ""} onChange={e => setData(d => ({ ...d, surface: e.target.value }))} disabled={isSubmitting} />
        </div>
        <Input label="Tarif / jour (€)" type="number" value={data?.tarif_jour || ""} onChange={e => setData(d => ({ ...d, tarif_jour: e.target.value }))} disabled={isSubmitting} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>Équipements</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {(Array.isArray(equipements) ? equipements : []).map(eq => {
              const sel = data?.equipements?.some(e => (e.id || e) == eq.id);
              return (
                <button key={eq.id} type="button" onClick={() => toggleEquip(setData, eq)} disabled={isSubmitting} style={{ padding: "0.3rem 0.8rem", borderRadius: "100px", border: `1px solid ${sel ? "#7bdff2" : "rgba(26,58,69,0.15)"}`, background: sel ? "rgba(123,223,242,0.12)" : "transparent", color: sel ? "#1a3a45" : "#4a7a85", fontSize: "0.78rem", fontWeight: sel ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                  {eq.libelle}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onCancel} disabled={isSubmitting}>Annuler</Btn>
          <Btn variant="cyan" onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
};

const prepareFormData = (data) => {
  const formData = new FormData();
  formData.append('nom', data.nom);
  formData.append('surface', data.surface);
  formData.append('type', data.type || 'bureau');
  formData.append('tarif_jour', data.tarif_jour);

  if (data.photoFile) {
    formData.append('photo', data.photoFile);
  }

  if (Array.isArray(data.equipements)) {
    data.equipements.forEach((eq, index) => {
      formData.append(`equipements[${index}]`, eq.id || eq);
    });
  }

  return formData;
};

export default function Espaces() {
  const [espaces, setEspaces] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editEspace, setEditEspace] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const empty = { nom: "", type: "bureau", surface: "", tarif_jour: "", equipements: [] };
  const [newEspace, setNewEspace] = useState(empty);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const fetchData = async () => {
      try {
        const [e, eq] = await Promise.all([
          apiAdminGetEspaces(page),
          apiGetEquipements()
        ]);

        const listEspaces = e.data?.data?.data ?? [];
        setEspaces(listEspaces);
        setPagination(e.data?.data?.meta ?? null);

        const listEquip = eq.data?.data?.data ?? [];
        setEquipements(listEquip);

      } catch (err) {
        console.error("Erreur fetchData →", err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, [refreshKey, page]);

  const handleCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = prepareFormData(newEspace);
      const res = await apiCreateEspace(formData);

      if (res.ok) {
        const created = res.data.data;
        setEspaces(prev => [...prev, created]);
        setShowCreate(false);
        setNewEspace(empty);
      } else {
        setError("Erreur lors de la création.");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    const id = editEspace.id;
    const snapshot = { ...editEspace };
    setIsSubmitting(true);
    try {
      const formData = prepareFormData(snapshot);
      const res = await apiUpdateEspace(id, formData);
      if (res.ok) {
        const updated = res.data.data;
        setEspaces(e => e.map(x => x.id === id ? updated : x));
        setEditEspace(null);
      } else {
        setError("Erreur lors de la mise à jour de l'espace.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiDeleteEspace(deleteConfirm);
      if (res.ok) {
        setEspaces(e => e.filter(x => x.id !== deleteConfirm));
        setDeleteConfirm(null);
      } else {
        setError("Erreur lors de la suppression de l'espace.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const safeEspaces = Array.isArray(espaces) ? espaces : [];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Espaces de travail</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>
            {pagination?.total || espaces.length} espace{ (pagination?.total || espaces.length) > 1 ? "s" : "" } au total
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            style={{ background: "white", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Rafraîchir"
          >
            🔄
          </button>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.8rem" }} />
            <span style={{ color: "#4a7a85" }}>à</span>
            <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.8rem" }} />
          </div>
          <Btn variant="cyan" onClick={() => setShowCreate(true)}>+ Ajouter</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {safeEspaces.map(e => (
          <div key={e.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
            <div style={{ height: 140, position: "relative", overflow: "hidden", filter: e.deleted_at ? "grayscale(100%) opacity(0.6)" : "none" }}>
              {e.photo ? (
                <img src={`${API_URL}/storage/${e.photo}`} alt={e.nom} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: TYPE_COLORS[e.type]?.bg || "#f0f4f5" }} />
              )}
              <div style={{ position: "absolute", top: "1rem", left: "1.2rem" }}>
                <Badge type={e.type} />
              </div>
              <div style={{ position: "absolute", top: "1rem", right: "1.2rem", display: "flex", gap: "0.5rem" }}>
                {e.deleted_at ? (
                  <span style={{ background: "#dc3545", color: "white", fontSize: "0.6rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "4px", textTransform: "uppercase" }}>
                    Supprimé
                  </span>
                ) : (
                  e.hasOwnProperty('is_available') && (
                    <span style={{ 
                      background: e.is_available ? "#4ade80" : "#f87171", 
                      color: "white", fontSize: "0.6rem", fontWeight: 800, 
                      padding: "0.2rem 0.5rem", borderRadius: "4px", textTransform: "uppercase" 
                    }}>
                      {e.is_available ? "Libre" : "Occupé"}
                    </span>
                  )
                )}
              </div>
              <div style={{ position: "absolute", bottom: "1rem", right: "1.2rem", background: "white", padding: "0.2rem 0.6rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, color: "#1a3a45", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                {e.surface} m²
              </div>
            </div>
            <div style={{ padding: "1.2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a3a45", marginBottom: "0.6rem" }}>{e.nom}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                {e.equipements?.map((eq, i) => (
                  <span key={eq.id || i} style={{ fontSize: "0.68rem", background: "#f0f4f5", color: "#4a7a85", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{eq.libelle}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: e.deleted_at ? "#4a7a85" : "#1a3a45" }}>{e.tarif_jour}€<span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#4a7a85" }}>/jour</span></span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!e.deleted_at && (
                    <>
                      <Btn size="sm" variant="ghost" onClick={() => setEditEspace({ ...e })} disabled={isSubmitting}>Modifier</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setDeleteConfirm(e.id)} disabled={isSubmitting}>×</Btn>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination pagination={pagination} page={page} onPage={setPage} />

      {showCreate && <EspaceForm title="Nouvel espace" data={newEspace} setData={setNewEspace} onSave={handleCreate} onCancel={() => setShowCreate(false)} equipements={equipements} isSubmitting={isSubmitting} />}
      {editEspace && <EspaceForm title="Modifier l'espace" data={editEspace} setData={setEditEspace} onSave={handleUpdate} onCancel={() => setEditEspace(null)} equipements={equipements} isSubmitting={isSubmitting} />}

      {deleteConfirm && (
        <Modal title="Supprimer l'espace ?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Cet espace sera archivé (suppression logique).
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)} disabled={isSubmitting}>Annuler</Btn>
            <Btn variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Suppression...' : 'Supprimer'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}