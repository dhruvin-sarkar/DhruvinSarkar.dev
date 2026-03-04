import React from "react";

const EmulatorLoadingScreen = ({ title, subtitle, variant = "default", onDismiss }) => {
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
            {onDismiss && (
              <div className="retro-performance-row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onDismiss} style={{ minWidth: '120px' }}>
                  Dismiss Loading
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmulatorLoadingScreen;
