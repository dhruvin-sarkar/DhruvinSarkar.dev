import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            fontFamily: "Tahoma, sans-serif",
            background: "#c0c0c0",
            border: "2px outset",
            margin: "2rem",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ color: "#c00", marginTop: 0 }}>This program has performed an illegal operation.</h2>
          <p>Something went wrong. Try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "4px 12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
