import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { useLowCarbon } from "../context/LowCarbonContext";
import LowCarbonToggle from "./LowCarbonToggle";

export default function SectionSilence() {
  const { lowCarbonMode } = useLowCarbon();
  const words = ["Respirez.", "Travaillez.", "Réservez."];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIndex(i => (i + 1) % words.length); setFade(true); }, 600);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      width: "100%",
      minHeight: "100vh",
      background: lowCarbonMode ? "#f0f8f5" : "#eff7f6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: isMobile ? "6rem 1.5rem 4rem" : "0",
      transition: "background 0.3s",
    }}>

      {!lowCarbonMode && (
        <svg viewBox="0 0 800 800" style={{
          position: "absolute",
          width: isMobile ? "120vw" : "70vw",
          height: isMobile ? "120vw" : "70vw",
          maxWidth: 700, maxHeight: 700,
          opacity: 0.15,
          animation: "breathe 10s ease-in-out infinite",
          pointerEvents: "none",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7bdff2" />
              <stop offset="100%" stopColor="#f7d6e0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M400,100 C520,80 680,160 720,300 C760,440 700,600 560,660 C420,720 240,680 160,560 C80,440 100,240 200,160 C270,100 340,115 400,100 Z" fill="url(#g1)" />
        </svg>
      )}

      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: isMobile ? "1.2rem 1.5rem" : "1.8rem 3rem",
        background: lowCarbonMode ? "rgba(240,248,245,0.98)" : "transparent",
        backdropFilter: lowCarbonMode ? "none" : "none",
        transition: "background 0.3s",
      }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a3a45", letterSpacing: "-0.02em" }}>EcoWork</span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {!isMobile && <LowCarbonToggle />}

          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <Link to="/dashboard" style={{
                textDecoration: "none",
                background: "#7bdff2", color: "#1a3a45",
                fontSize: "0.82rem", fontWeight: 600,
                padding: "0.5rem 1.2rem", borderRadius: "100px",
              }}>
                Mon espace
              </Link>
              <button onClick={handleLogout} style={{
                background: "transparent",
                border: "1px solid rgba(123,223,242,0.3)",
                color: "#7bdff2", fontSize: "0.82rem", fontWeight: 600,
                padding: "0.5rem 1.2rem", borderRadius: "100px", cursor: "pointer",
              }}> Se déconnecter</button>
            </div>
          ) : (
            <>
              {!isMobile && (
                <Link to="/login" style={{
                  textDecoration: "none", color: "#3d656e",
                  fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem",
                }}>
                  Connexion
                </Link>
              )}
              <Link to="/inscription" style={{
                textDecoration: "none",
                background: "#1a3a45", color: "#eff7f6",
                fontSize: "0.82rem", fontWeight: 600,
                padding: "0.5rem 1.2rem", borderRadius: "100px",
              }}>
                S'inscrire
              </Link>
            </>
          )}

          {isMobile && <LowCarbonToggle compact />}
        </div>
      </div>

      <div style={{
        textAlign: "center", position: "relative", zIndex: 1,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "none" : "translateY(20px)",
        transition: "all 1s ease",
      }}>
        <p style={{
          fontSize: "0.68rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "#7bdff2", marginBottom: "2rem",
        }}>GreenSpace</p>

        <h1 style={{
          fontSize: isMobile ? "clamp(3.5rem, 18vw, 6rem)" : "clamp(5rem, 12vw, 10rem)",
          fontWeight: 300, color: "#1a3a45",
          letterSpacing: "-0.04em", lineHeight: 1,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          userSelect: "none",
        }}>
          {words[index]}
        </h1>

        <p style={{
          marginTop: "2.5rem", fontSize: isMobile ? "0.88rem" : "1rem",
          color: "rgba(26,58,69,0.4)", letterSpacing: "0.02em",
          padding: isMobile ? "0 1rem" : "0",
        }}>
          La plateforme de coworking de GreenSpace.
        </p>

        <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/espaces" style={{
            textDecoration: "none",
            background: "#1a3a45", color: "#eff7f6",
            fontWeight: 600, fontSize: "0.88rem",
            padding: "0.9rem 2rem", borderRadius: "100px",
          }}>
            Réserver un espace
          </Link>
          <a href="#flow" style={{
            textDecoration: "none", color: "#3d656e",
            fontSize: "0.88rem", fontWeight: 500,
            padding: "0.9rem 1rem",
            borderBottom: "1px solid rgba(61,101,110,0.3)",
          }}>
            Découvrir ↓
          </a>
        </div>

        {lowCarbonMode && (
          <div style={{
            marginTop: "2rem",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            background: "#e8faf8", border: "1px solid #b2e8de",
            borderRadius: "100px",
          }}>
            <span>🌿</span>
            <span style={{ fontSize: "0.75rem", color: "#0d7a6a", fontWeight: 500 }}>
              Mode Low Carbon actif — animations réduites
            </span>
          </div>
        )}
      </div>

      {!lowCarbonMode && (
        <div style={{
          position: "absolute", bottom: "2rem",
          left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          opacity: 0.8,
        }}>
          <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a45" }}>Défiler</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #1a3a45, transparent)", animation: "scrollDrop 2s ease-in-out infinite" }} />
        </div>
      )}
    </section>
  );
}