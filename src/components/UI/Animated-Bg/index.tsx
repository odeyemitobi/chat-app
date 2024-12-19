"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BubbleStyle extends React.CSSProperties {
  width: string;
  height: string;
  background: string;
}

const AnimatedBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!backgroundRef.current) return;

    const colors: string[] = ["#60A5FA", "#818CF8", "#A78BFA"];
    const bubbles: HTMLDivElement[] = [];

    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement("div");
      bubble.className = "absolute rounded-full blur-xl opacity-20";
      const bubbleStyle: BubbleStyle = {
        background: colors[Math.floor(Math.random() * colors.length)],
        width: `${Math.random() * 200 + 100}px`,
        height: `${Math.random() * 200 + 100}px`,
      };
      Object.assign(bubble.style, bubbleStyle);

      backgroundRef.current.appendChild(bubble);
      bubbles.push(bubble);
      bubblesRef.current.push(bubble);
    }

    const animateBubble = (bubble: HTMLDivElement): void => {
      gsap.to(bubble, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 4 + 4,
        ease: "sine.inOut",
        onComplete: () => animateBubble(bubble),
      });
    };

    bubbles.forEach((bubble) => {
      gsap.set(bubble, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      });

      animateBubble(bubble);
    });

    gsap.to(backgroundRef.current, {
      background: "linear-gradient(45deg, #1E40AF, #4F46E5, #7C3AED)",
      duration: 10,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      gsap.killTweensOf(bubblesRef.current);
      bubblesRef.current.forEach((bubble) => bubble.remove());
      bubblesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="fixed z-[-1] inset-0 overflow-hidden bg-gradient-to-br from-blue-800 to-purple-800"
    />
  );
};

export default AnimatedBackground;
