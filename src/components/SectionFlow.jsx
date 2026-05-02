import { useWindowWidth } from "../hooks/useWindowWidth";
import { useSectionVisible } from "../hooks/useSectionVisible";

function FlowStep({ step, index, isMobile }) {
  const [ref, visible] = useSectionVisible(0.2);
  return (
    <div ref={ref} style={{
      textAlign: "center",
      padding: isMobile ? "2.5rem 1rem" : "3rem 2rem",
      borderRight: !isMobile && index < 2 ? "1px solid rgba(26,58,69,0.08)" : "none",
      borderBottom: isMobile && index < 2 ? "1px solid rgba(26,58,69,0.08)" : "none",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: `all 0.9s ${index * 0.18}s ease`,
    }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(26,58,69,0.2)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 style={{ fontSize: isMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "#1a3a45", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.8rem" }}>
        {step.word}
      </h3>
      <p style={{ fontSize: "0.8rem", color: "rgba(26,58,69,0.4)", lineHeight: 1.6 }}>{step.sub}</p>
    </div>
  );
}

export default function SectionFlow() {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const steps = [
    { word: "Choisir", sub: "L'espace qui vous convient" },
    { word: "Planifier", sub: "Votre date et durée" },
    { word: "Confirmer", sub: "En quelques secondes" },
  ];

  return (
    <section id="flow" style={{ width: "100%", background: "#eff7f6", padding: isMobile ? "6rem 1.5rem" : "10rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1b5e6e", marginBottom: "4rem" }}>Le flux</p>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        width: "100%", maxWidth: 900,
      }}>
        {steps.map((s, i) => <FlowStep key={i} step={s} index={i} isMobile={isMobile} />)}
      </div>
    </section>
  );
}