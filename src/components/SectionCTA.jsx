import { useWindowWidth } from "../hooks/useWindowWidth";
import { useSectionVisible } from "../hooks/useSectionVisible";

export default function SectionCTA() {
  const [ref, visible] = useSectionVisible(0.3);
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section ref={ref} style={{
      width: "100%",
      background: "#eff7f6",
      minHeight: "80vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? "8rem 1.5rem" : "8rem 3rem",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {[60, 40, 22].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${size}vw`, height: `${size}vw`,
          borderRadius: "50%",
          border: `1px solid rgba(123,223,242,${0.06 + i * 0.04})`,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          minWidth: 100, minHeight: 100,
        }} />
      ))}

      <p style={{
        fontSize: "0.65rem", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "#7bdff2", marginBottom: "1.8rem",
        opacity: visible ? 1 : 0, transition: "all 0.8s ease",
      }}>GreenSpace · EcoWork</p>

      <h2 style={{
        fontSize: isMobile ? "2.5rem" : "clamp(3rem, 7vw, 7rem)",
        fontWeight: 300, color: "#1a3a45",
        letterSpacing: "-0.04em", lineHeight: 1.05,
        marginBottom: "3rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "all 1s 0.1s ease",
      }}>
        Un espace.<br />
        <span style={{ color: "#7bdff2" }}>Une respiration.</span>
      </h2>

      <a href="/espaces" style={{
        textDecoration: "none",
        background: "#1a3a45", color: "#eff7f6",
        padding: "1.1rem 3rem", borderRadius: "100px",
        fontSize: "0.9rem", fontWeight: 600,
        letterSpacing: "0.04em",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: "all 1s 0.25s ease",
        display: "inline-block",
      }}>Explorer les espaces</a>

      <div style={{
        position: "absolute", bottom: "2rem",
        fontSize: "0.68rem", color: "rgba(26,58,69,0.8)",
        letterSpacing: "0.05em",
      }}>
        © 2025 GreenSpace · Paris 11e · Hébergement vert
      </div>
    </section>
  );
}