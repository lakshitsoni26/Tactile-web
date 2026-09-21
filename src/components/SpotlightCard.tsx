"use client";

import { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tilt?: boolean;
}

export default function SpotlightCard({
  children,
  className = "",
  style,
  tilt = true,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;
      setTiltStyle({ rotateX, rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered && tilt
          ? `perspective(1000px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) translateZ(6px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        ...style,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor Spotlight Layer (Acid Green) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(57, 255, 20, 0.10), transparent 75%)`,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Specular Rim Light with Acid Green Edge */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(240px circle at ${coords.x}px ${coords.y}px, rgba(57, 255, 20, 0.45), transparent 70%)`,
          WebkitMaskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          transition: "opacity 0.25s ease",
        }}
      />

      {children}
    </div>
  );
}
