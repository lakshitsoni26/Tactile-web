export default function DistortionFilter() {
  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          id="nav-glass-dist"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="92"
            stitchTiles="stitch"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="45"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
          <feImage
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='672' height='72'%3E%3Crect width='672' height='72' rx='36' fill='white'/%3E%3C/svg%3E"
            x="0"
            y="0"
            width="672"
            height="72"
            result="pill"
          />
          <feComposite in="disp" in2="pill" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
