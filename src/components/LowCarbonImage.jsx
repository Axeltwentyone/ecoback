import { useContext } from "react";
import { LowCarbonContext } from "../context/LowCarbonContext";

export default function LowCarbonImage({ photo, alt, style }) {

  const { lowCarbonMode } = useContext(LowCarbonContext);

  return (
    <img
      src={photo}
      alt={alt}
      style={style}
      loading={lowCarbonMode ? "lazy" : "eager"}
    />
  );
}