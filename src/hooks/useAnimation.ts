import { useEffect } from "react";
import { gsap } from "gsap";

export const useMessageAnimation = (
  elementRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [elementRef]);
};
