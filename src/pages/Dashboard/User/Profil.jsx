import { useState } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useLowCarbon } from "../../../context/LowCarbonContext"

export default function Profil() {
  const { lowCarbonMode } = useLowCarbon();
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(stored);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState({ current: "", new: "", confirm: "" });
  const [pinError, setPinError] = useState("");

  const cardStyle = {
    background: lowCarbonMode ? "#f0f8f5" : "white",
    borderRadius: "16px", padding: "1.8rem", marginBottom: "1rem",
    boxShadow: lowCarbonMode ? "none" : "0 1px 12px rgba(26,58,69,0.06)",
    border: lowCarbonMode ? "1px solid #d0e8e0" : "none",
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePinChange = () => {
    if (pin.new.length < 6) { setPinError("Le nouveau PIN doit contenir 6 chiffres"); return; }
    if (pin.new !== pin.confirm) { setPinError("Les PINs ne correspondent pas"); return; }
    setPinError("");
    setShowPin(false);
    setPin({ current: "", new: "", confirm: "" });
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 600 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Mon profil</h2>
        <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>Gérez vos informations personnelles</p>
      </div>

      {saved && (
        <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "10px", padding: "0.9rem 1.2rem", fontSize: "0.85rem", color: "#16a34a", marginBottom: "1.5rem" }}>
          ✓ Profil mis à jour avec succès
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: lowCarbonMode ? "#d0e8e0" : "rgba(247,214,224,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 700, color: "#1a3a45", flexShrink: 0 }}>
            {user.prenom?.[0]}{user.nom?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a3a45", marginBottom: "0.2rem" }}>{user.prenom} {user.nom}</div>
            <div style={{ fontSize: "0.75rem", color: "#4a7a85" }}>Membre EcoWork</div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a3a45" }}>Informations personnelles</h3>
          {!editing
            ? <Btn size="sm" variant="ghost" onClick={() => setEditing(true)}>Modifier</Btn>
            : <div style={{ display: "flex", gap: "0.5rem" }}>
                <Btn size="sm" variant="ghost" onClick={() => setEditing(false)}>Annuler</Btn>
                <Btn size="sm" variant="cyan" onClick={handleSave}>Enregistrer</Btn>
              </div>
          }
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input label="Nom" value={user.nom || ""} onChange={e => setUser(u => ({ ...u, nom: e.target.value }))} disabled={!editing} />
            <Input label="Prénom" value={user.prenom || ""} onChange={e => setUser(u => ({ ...u, prenom: e.target.value }))} disabled={!editing} />
          </div>
          <Input label="Email" type="email" value={user.email || ""} onChange={e => setUser(u => ({ ...u, email: e.target.value }))} disabled={!editing} />
          <Input label="Téléphone" value={user.numero || ""} onChange={e => setUser(u => ({ ...u, numero: e.target.value }))} disabled={!editing} />
          <Input label="Adresse postale" value={user.adresse_postale || ""} onChange={e => setUser(u => ({ ...u, adresse_postale: e.target.value }))} disabled={!editing} />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a3a45", marginBottom: "0.3rem" }}>Code PIN</h3>
            <p style={{ fontSize: "0.78rem", color: "#4a7a85" }}>Modifiez votre code PIN de connexion</p>
          </div>
          <Btn size="sm" variant="ghost" onClick={() => setShowPin(true)}>Changer le PIN</Btn>
        </div>
      </div>

      {showPin && (
        <Modal title="Changer le code PIN" onClose={() => setShowPin(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="PIN actuel" type="password" value={pin.current} onChange={e => setPin(p => ({ ...p, current: e.target.value }))} placeholder="••••••" />
            <Input label="Nouveau PIN" type="password" value={pin.new} onChange={e => setPin(p => ({ ...p, new: e.target.value }))} placeholder="••••••" />
            <Input label="Confirmer le nouveau PIN" type="password" value={pin.confirm} onChange={e => setPin(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••" />
            {pinError && <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{pinError}</p>}
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowPin(false)}>Annuler</Btn>
              <Btn variant="cyan" onClick={handlePinChange}>Mettre à jour</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}