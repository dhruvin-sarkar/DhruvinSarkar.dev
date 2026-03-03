import React from "react";

const EmulatorLoadingScreen = ({ title, subtitle, variant = "default" }) => {
  const icon = variant === "warning" ? "!" : variant === "quake" ? "*" : ">";

  return (
    <div className="emulator-loading-screen">
      <div className="emulator-loading-card">
        <h2>{title || "Loading"}</h2>
        <div className="panel-body">
          <div className="win95-panel-icon">{icon}</div>
          <div className="win95-panel-copy">
            <p>{subtitle || "Preparing application..."}</p>
            <div className="emulator-loading-bar">
              <div className="emulator-loading-bar-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmulatorLoadingScreen;
