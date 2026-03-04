import React, { useContext } from "react";
import Draggable from "../../system/WindowDraggable";
import UseContext from "../../../Context";
import defaultIcon from "../../../assets/95icon.png";

const normalizeIconSource = (iconPath) => {
  if (!iconPath) return defaultIcon;
  return iconPath.endsWith(".svg") ? iconPath.replace(/\.svg$/i, ".png") : iconPath;
};


const AppWindowShell = ({
  title,
  icon,
  state,
  setState,
  stateName,
  defaultWidth = 800,
  defaultHeight = 600,
  defaultPosition = { x: 60, y: 60 },
  children,
  className = "",
}) => {
  const {
    setRightClickDefault,
    themeDragBar,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
    minimizeWindow,
  } = useContext(UseContext);

  if (!state?.show) return null;

  const hasPersistedPosition =
    state?.hasPosition === true ||
    (Number.isFinite(state?.x) &&
      Number.isFinite(state?.y) &&
      !(state?.x === 0 && state?.y === 0 && state?.hasPosition !== true));

  const windowStyle = state.expand
    ? {
        ...inlineStyleExpand(stateName),
      }
    : {
        ...inlineStyle(stateName),
        width: `${defaultWidth}px`,
        height: `${defaultHeight}px`,
      };

  const focusWindow = () => {
    handleSetFocusItemTrue(stateName);
  };

  const handleDragStop = (_event, data) => {
    setState((previous) => ({
      ...previous,
      x: data.x,
      y: data.y,
      hasPosition: true,
    }));
  };

  const handleMinimize = (event) => {
    event?.stopPropagation?.();
    minimizeWindow(setState);
  };

  const handleToggleExpand = (event) => {
    event?.stopPropagation?.();
    setState((previous) => ({
      ...previous,
      expand: !previous.expand,
      hide: false,
      focusItem: true,
    }));
  };

  const handleClose = (event) => {
    event?.stopPropagation?.();
    deleteTap(stateName);
  };

  return (
    <Draggable
      axis="both"
      handle={`.retro-dragbar-${stateName.replace(/\s+/g, "")}`}
      grid={[1, 1]}
      scale={1}
      disabled={state.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: hasPersistedPosition ? state.x : defaultPosition.x,
        y: hasPersistedPosition ? state.y : defaultPosition.y,
      }}
      position={hasPersistedPosition ? { x: state.x, y: state.y } : undefined}
      onStop={handleDragStop}
      onStart={focusWindow}
    >
      <div
        className={`retro-app-window ${className}`.trim()}
        onClick={(event) => {
          event.stopPropagation();
          focusWindow();
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setRightClickDefault(false);
        }}
        style={windowStyle}
      >
        <div
          className={`retro-dragbar retro-dragbar-${stateName.replace(/\s+/g, "")}`}
          style={{ background: state.focusItem ? themeDragBar : "#757579" }}
          onDoubleClick={handleToggleExpand}
        >
          <div className="retro-dragbar-title">
            <img
              src={normalizeIconSource(icon)}
              alt={title}
              onError={(e) => {
                const img = e.currentTarget;
                const originalIcon = icon || "";
                const current = img.getAttribute("src") || "";

                if (
                  originalIcon.toLowerCase().endsWith(".svg") &&
                  current.toLowerCase().endsWith(".png")
                ) {
                  img.src = originalIcon;
                  return;
                }

                img.src = defaultIcon;
              }}
            />
            <span>{title}</span>
          </div>
          <div className="retro-dragbar-buttons" data-no-drag>
            <button
              type="button"
              className="retro-title-button"
              onClick={!isTouchDevice ? handleMinimize : undefined}
              onTouchEnd={handleMinimize}
              title="Minimize"
              data-no-drag
            >
              <span>_</span>
            </button>
            <button
              type="button"
              className="retro-title-button"
              onClick={!isTouchDevice ? handleToggleExpand : undefined}
              onTouchEnd={handleToggleExpand}
              title={state.expand ? "Restore" : "Maximize"}
              data-no-drag
            >
              <span className={state.expand ? "retro-title-restore" : "retro-title-maximize"} />
            </button>
            <button
              type="button"
              className="retro-title-button retro-close-button"
              onClick={!isTouchDevice ? handleClose : undefined}
              onTouchEnd={handleClose}
              title="Close"
              data-no-drag
            >
              <span>{"\u00D7"}</span>
            </button>
          </div>
        </div>

        <div className="retro-window-content">{children}</div>
      </div>
    </Draggable>
  );
};

export default AppWindowShell;

