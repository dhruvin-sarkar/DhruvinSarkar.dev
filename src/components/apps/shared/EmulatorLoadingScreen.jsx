import React from "react";

const EmulatorLoadingScreen = ({
  title,
  subtitle,
  variant = "default",
}) => {
  const palette =
    variant === "warning"
      ? { bar: "#ff9933", glow: "rgba(255, 153, 51, 0.35)" }
      : variant === "quake"
        ? { bar: "#d64141", glow: "rgba(214, 65, 65, 0.35)" }
        : { bar: "#6aa2ff", glow: "rgba(106, 162, 255, 0.35)" };

  return (
    <div className="emulator-loading-screen">
      <div className="emulator-loading-card">
        <h2>{title || "Loading"}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
        <div className="emulator-loading-bar">
          <div
            className="emulator-loading-bar-fill"
            style={{
              background: palette.bar,
              boxShadow: `0 0 12px ${palette.glow}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmulatorLoadingScreen;
