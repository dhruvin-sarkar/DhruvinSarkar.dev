const CRT_OVERLAY_Z_INDEX = 1000000001;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: CRT_OVERLAY_Z_INDEX,
  },
  layer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  scanlines: {
    background: `repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.16) 0px,
      rgba(0,0,0,0.16) 1px,
      transparent 1px,
      transparent 2px
    )`,
    opacity: 0.45,
  },
  vignette: {
    background: `radial-gradient(
      ellipse at center,
      transparent 72%,
      rgba(0,0,0,0.18) 100%
    )`,
  },
  flicker: {
    background: "rgba(255, 255, 255, 0.012)",
    opacity: 0.947,
    animation: "crtOverlayFlicker 4s ease-in-out infinite",
    willChange: "opacity",
  },
  glow: {
    background: "rgba(0, 20, 0, 0.12)",
  },
};

export default function CRTOverlay() {
  return (
    <div aria-hidden="true" style={styles.overlay}>
      <style>
        {`
          @keyframes crtOverlayFlicker {
            0%,
            100% {
              opacity: 0.947;
            }

            50% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={{ ...styles.layer, ...styles.scanlines }} />
      <div style={{ ...styles.layer, ...styles.vignette }} />
      <div style={{ ...styles.layer, ...styles.flicker }} />
      <div style={{ ...styles.layer, ...styles.glow }} />
    </div>
  );
}
