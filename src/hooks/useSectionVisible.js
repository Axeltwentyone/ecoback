import { useState, useEffect, useRef } from "react";

export const useSectionVisible = (threshold = 0.3) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};
