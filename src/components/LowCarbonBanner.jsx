import { useContext } from "react";
import { useLowCarbon } from '../context/LowCarbonContext'

export default function LowCarbonBanner() {

  const { lowCarbonMode } = useLowCarbon();

  if (!lowCarbonMode) return null;

  return (
    <div style={{
      background:"#e6f7ec",
      padding:"10px",
      textAlign:"center"
    }}>
      🌱 Mode Low Carbon activé
    </div>
  );
}