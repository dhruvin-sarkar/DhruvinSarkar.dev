import React, { useContext } from "react";
import Draggable from "../../system/WindowDraggable";
import UseContext from "../../../Context";

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
    StyleHide,
  } = useContext(UseContext);

  if (!state?.show) return null;

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
    }));
  };

  const handleMinimize = (event) => {
    event?.stopPropagation?.();
    setState((previous) => ({ ...previous, hide: true, focusItem: false }));
    StyleHide(stateName);
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
        x: Number.isFinite(state.x) ? state.x : defaultPosition.x,
        y: Number.isFinite(state.y) ? state.y : defaultPosition.y,
      }}
      position={
        Number.isFinite(state.x) && Number.isFinite(state.y)
          ? { x: state.x, y: state.y }
          : undefined
      }
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
            {icon ? <img src={icon} alt={title} /> : null}
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
              <span>{state.expand ? "?" : "?"}</span>
            </button>
            <button
              type="button"
              className="retro-title-button retro-close-button"
              onClick={!isTouchDevice ? handleClose : undefined}
              onTouchEnd={handleClose}
              title="Close"
              data-no-drag
            >
              <span>×</span>
            </button>
          </div>
        </div>

        <div className="retro-window-content">{children}</div>
      </div>
    </Draggable>
  );
};

export default AppWindowShell;
