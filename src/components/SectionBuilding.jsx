import { useState, useEffect } from "react";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { useSectionVisible } from "../hooks/useSectionVisible";
import { useLowCarbon } from "../context/LowCarbonContext";

export default function SectionBuilding() {
  const { lowCarbonMode } = useLowCarbon();
  const [ref, visible] = useSectionVisible(0.2);
  const [progress, setProgress] = useState(0);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    if (lowCarbonMode) return;
    const fn = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setProgress(p);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [lowCarbonMode]);

  const floor3 = lowCarbonMode ? true : progress > 0.1;
  const floor2 = lowCarbonMode ? true : progress > 0.4;
  const floor1 = lowCarbonMode ? true : progress > 0.7;

  return (
    <section ref={ref} style={{
      width: "100%",
      minHeight: lowCarbonMode ? "100vh" : (isMobile ? "150vh" : "250vh"),
      background: "#1a3a45",
      position: "relative",
      transition: "min-height 0.3s",
    }}>
      <div style={{
        width: "100%",
        position: lowCarbonMode ? "relative" : "sticky",
        top: 0, height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "2rem" : "6rem",
        padding: isMobile ? "2rem 1.5rem" : "0 6rem",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: isMobile ? "100%" : 280,
          textAlign: isMobile ? "center" : "left",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateX(-20px)",
          transition: "all 1s ease",
          order: isMobile ? 2 : 1,
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7bdff2", marginBottom: "1rem" }}>L'espace</p>
          <h2 style={{ fontSize: isMobile ? "1.4rem" : "1.8rem", fontWeight: 300, color: "#eff7f6", lineHeight: 1.4, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
            Un bâtiment pensé pour la concentration.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: isMobile ? "center" : "flex-start" }}>
            {[
              { label: "Bureaux individuels", active: floor1, color: "#b2f7ef" },
              { label: "Salles de réunion", active: floor2, color: "#7bdff2" },
              { label: "Espaces conférence", active: floor3, color: "#f7d6e0" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", opacity: f.active ? 1 : 0.25, transition: "opacity 0.8s ease" }}>
                <div style={{ width: 24, height: 1, background: f.active ? f.color : "rgba(239,247,246,0.2)", transition: "background 0.8s ease" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: f.active ? 600 : 400, color: f.active ? f.color : "rgba(239,247,246,0.3)", transition: "all 0.8s ease" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 320 420" style={{
          width: isMobile ? "min(260px, 70vw)" : "min(320px, 35vw)",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(30px)",
          transition: "all 1.2s ease",
          filter: lowCarbonMode ? "none" : "drop-shadow(0 30px 60px rgba(0,0,0,0.4))",
          order: isMobile ? 1 : 2,
          flexShrink: 0,
        }}>
          <rect x="40" y="390" width="240" height="6" rx="3" fill="rgba(239,247,246,0.08)" />

          <g style={{ opacity: floor3 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="50" y="300" width="220" height="88" rx="4" fill={floor3 ? "rgba(247,214,224,0.1)" : "rgba(239,247,246,0.03)"} stroke={floor3 ? "#f7d6e0" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[80, 120, 160, 200, 240].map(x => (
              <rect key={x} x={x} y="314" width="16" height="55" rx="2" fill={floor3 ? "rgba(247,214,224,0.18)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="348" textAnchor="middle" fill={floor3 ? "#f7d6e0" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1">CONFÉRENCE</text>
          </g>

          <g style={{ opacity: floor2 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="55" y="200" width="210" height="95" rx="4" fill={floor2 ? "rgba(123,223,242,0.08)" : "rgba(239,247,246,0.03)"} stroke={floor2 ? "#7bdff2" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[75, 115, 155, 195, 235].map(x => (
              <rect key={x} x={x} y="214" width="16" height="62" rx="2" fill={floor2 ? "rgba(123,223,242,0.15)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="252" textAnchor="middle" fill={floor2 ? "#7bdff2" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1">RÉUNION</text>
          </g>

          <g style={{ opacity: floor1 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="70" y="100" width="180" height="95" rx="4" fill={floor1 ? "rgba(178,247,239,0.08)" : "rgba(239,247,246,0.03)"} stroke={floor1 ? "#b2f7ef" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[90, 128, 166, 204].map(x => (
              <rect key={x} x={x} y="114" width="14" height="63" rx="2" fill={floor1 ? "rgba(178,247,239,0.18)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="152" textAnchor="middle" fill={floor1 ? "#b2f7ef" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1">BUREAUX</text>
          </g>

          <polygon points="160,30 80,100 240,100" fill="rgba(239,247,246,0.05)" stroke="rgba(239,247,246,0.18)" strokeWidth="1" />
          <line x1="160" y1="30" x2="160" y2="12" stroke="rgba(239,247,246,0.2)" strokeWidth="1" />
          <circle cx="160" cy="10" r="2" fill="#7bdff2" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}