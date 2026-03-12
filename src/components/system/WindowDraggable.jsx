import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
const DEFAULT_MIN_WIDTH = 300;
const DEFAULT_MIN_HEIGHT = 200;
const EDGE_SIZE = 6;
const CORNER_SIZE = 12;
const OVERLAY_Z_INDEX = 9999;
// Reserve titlebar control area so resize handles do not block minimize/maximize/close buttons.
const TITLEBAR_SAFE_ZONE = 20;
const TOP_RIGHT_CONTROL_GUTTER = 140;
const DEFAULT_DRAG_CANCEL_SELECTOR = [
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "a",
  "[role='button']",
  "[contenteditable='true']",
  "[class*='barbtn']",
  "[class*='barbtn'] *",
  "[class*='title-buttons']",
  "[class*='title-buttons'] *",
  "[class*='controls']",
  "[class*='controls'] *",
  "[data-no-drag]",
  "[data-no-drag] *",
].join(", ");

const RESIZE_CURSORS = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPoint(event) {
  if (!event) return null;
  if (event.touches && event.touches[0]) return event.touches[0];
  if (event.changedTouches && event.changedTouches[0]) return event.changedTouches[0];
  return event;
}

function isWindowHandleSelector(handle) {
  if (typeof handle !== "string") return false;
  const normalized = handle.toLowerCase();
  // Desktop icon draggables also use this wrapper, but they should not gain window resize handles.
  if (normalized.includes("icon")) return false;
  return true;
}

function readInitialPosition(position, defaultPosition) {
  const x = Number.isFinite(position?.x) ? position.x : Number.isFinite(defaultPosition?.x) ? defaultPosition.x : 0;
  const y = Number.isFinite(position?.y) ? position.y : Number.isFinite(defaultPosition?.y) ? defaultPosition.y : 0;
  return { x, y };
}

function clampWindowPosition(rawX, rawY, width, height) {
  const viewportWidth = window.innerWidth || 0;
  const viewportHeight = window.innerHeight || 0;
  const maxX = Math.max(0, viewportWidth - (width || 0));
  const maxY = Math.max(0, viewportHeight - (height || 0));
  return {
    x: clamp(rawX, 0, maxX),
    y: clamp(rawY, 0, maxY),
  };
}

function getHandleStyle(direction) {
  const base = {
    position: "absolute",
    background: "transparent",
    zIndex: 5,
    pointerEvents: "auto",
    cursor: RESIZE_CURSORS[direction],
    touchAction: "none",
  };

  switch (direction) {
    case "n":
      return { ...base, left: 0, right: TOP_RIGHT_CONTROL_GUTTER, top: 0, height: EDGE_SIZE };
    case "s":
      return { ...base, left: 0, right: 0, bottom: 0, height: EDGE_SIZE };
    case "e":
      return { ...base, top: TITLEBAR_SAFE_ZONE, bottom: 0, right: 0, width: EDGE_SIZE };
    case "w":
      return { ...base, top: TITLEBAR_SAFE_ZONE, bottom: 0, left: 0, width: EDGE_SIZE };
    case "ne":
      return { ...base, top: TITLEBAR_SAFE_ZONE, right: 0, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 6 };
    case "nw":
      return { ...base, top: TITLEBAR_SAFE_ZONE, left: 0, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 6 };
    case "se":
      return { ...base, bottom: 0, right: 0, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 6 };
    case "sw":
      return { ...base, bottom: 0, left: 0, width: CORNER_SIZE, height: CORNER_SIZE, zIndex: 6 };
    default:
      return base;
  }
}

function resolveMinDimension(value, fallback) {
  if (Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function ResizeHandle({ direction, disabled, onStartResize }) {
  if (disabled) return null;
  const style = getHandleStyle(direction);

  const handleStart = (event) => {
    if (event.type === "touchstart") event.preventDefault();
    onStartResize(event, direction);
  };

  return (
    <div
      data-resize-direction={direction}
      style={style}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    />
  );
}

const WindowDraggable = React.forwardRef(function WindowDraggable(props, ref) {
  const {
    children,
    handle,
    disabled,
    cancel,
    onStart,
    onDrag,
    onStop,
    defaultPosition,
    position,
    ...rest
  } = props;

  const shouldEnhanceWindow = isWindowHandleSelector(handle) && React.isValidElement(children);

  if (!shouldEnhanceWindow) {
    return (
      <Draggable ref={ref} {...props}>
        {children}
      </Draggable>
    );
  }

  const [windowPosition, setWindowPosition] = useState(() => readInitialPosition(position, defaultPosition));
  const [windowSize, setWindowSize] = useState({
    width: null,
    height: null,
    minWidth: DEFAULT_MIN_WIDTH,
    minHeight: DEFAULT_MIN_HEIGHT,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);

  const childNodeRef = useRef(null);
  const resizeSessionRef = useRef(null);
  const positionRef = useRef(windowPosition);
  const sizeRef = useRef(windowSize);
  const hasSyncedInitialPositionRef = useRef(false);
  const previousDisabledRef = useRef(Boolean(disabled));
  const preDisabledRectRef = useRef(null);
  const mergedCancelSelector = useMemo(() => {
    if (!cancel) return DEFAULT_DRAG_CANCEL_SELECTOR;
    return `${cancel}, ${DEFAULT_DRAG_CANCEL_SELECTOR}`;
  }, [cancel]);

  useEffect(() => {
    positionRef.current = windowPosition;
  }, [windowPosition]);

  useEffect(() => {
    sizeRef.current = windowSize;
  }, [windowSize]);

  useEffect(() => {
    if (isDragging || isResizing) return;
    if (!Number.isFinite(position?.x) || !Number.isFinite(position?.y)) return;
    setWindowPosition({ x: position.x, y: position.y });
  }, [position?.x, position?.y, isDragging, isResizing]);

  useLayoutEffect(() => {
    const wasDisabled = previousDisabledRef.current;
    const isDisabled = Boolean(disabled);

    if (!wasDisabled && isDisabled) {
      // Maximize entering: snapshot position + size so restore can return to the same rectangle.
      const node = childNodeRef.current;
      const rect = node ? node.getBoundingClientRect() : null;
      preDisabledRectRef.current = {
        x: positionRef.current.x,
        y: positionRef.current.y,
        width: Number.isFinite(sizeRef.current.width) ? sizeRef.current.width : rect ? Math.round(rect.width) : null,
        height: Number.isFinite(sizeRef.current.height) ? sizeRef.current.height : rect ? Math.round(rect.height) : null,
      };
    }

    if (wasDisabled && !isDisabled && preDisabledRectRef.current) {
      // Maximize leaving: restore the pre-max rectangle to avoid corner snapping after fullscreen.
      const restoredRect = preDisabledRectRef.current;
      const nextWidth = Number.isFinite(restoredRect.width) ? restoredRect.width : sizeRef.current.width;
      const nextHeight = Number.isFinite(restoredRect.height) ? restoredRect.height : sizeRef.current.height;

      if (Number.isFinite(nextWidth) && Number.isFinite(nextHeight)) {
        setWindowSize((previous) => ({
          ...previous,
          width: Math.round(nextWidth),
          height: Math.round(nextHeight),
        }));
      }

      const restoredPosition = clampWindowPosition(
        restoredRect.x,
        restoredRect.y,
        nextWidth || 0,
        nextHeight || 0,
      );
      setWindowPosition(restoredPosition);
      if (typeof onStop === "function") {
        onStop(
          { type: "restore-position-sync" },
          {
            node: childNodeRef.current,
            x: restoredPosition.x,
            y: restoredPosition.y,
            deltaX: 0,
            deltaY: 0,
            lastX: restoredPosition.x,
            lastY: restoredPosition.y,
          },
        );
      }
      preDisabledRectRef.current = null;
    }

    previousDisabledRef.current = isDisabled;
  }, [disabled, onStop]);

  useEffect(() => {
    if (hasSyncedInitialPositionRef.current) return;
    // Controlled draggables already provide authoritative coordinates.
    if (Number.isFinite(position?.x) && Number.isFinite(position?.y)) {
      hasSyncedInitialPositionRef.current = true;
      return;
    }
    if (typeof onStop !== "function") {
      hasSyncedInitialPositionRef.current = true;
      return;
    }

    // Many app windows use defaultPosition + onStop to persist x/y.
    // Sync initial coordinates once so maximize/restore math does not assume x/y = 0.
    const { x, y } = positionRef.current;
    onStop(
      { type: "init-position-sync" },
      {
        node: childNodeRef.current,
        x,
        y,
        deltaX: 0,
        deltaY: 0,
        lastX: x,
        lastY: y,
      },
    );
    hasSyncedInitialPositionRef.current = true;
  }, [onStop, position?.x, position?.y]);

  useLayoutEffect(() => {
    // Do not capture "maximized/fullscreen" dimensions as the normal restorable size.
    // If we measured while disabled=true, unmaximize would keep a giant width/height and clamp to a corner.
    if (disabled) return;
    const node = childNodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    setWindowSize((previous) => {
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (previous.width === width && previous.height === height) return previous;
      return { ...previous, width, height };
    });
  }, [disabled, children]);

  const applyBodySelectionLock = useCallback((locked) => {
    document.body.style.userSelect = locked ? "none" : "";
  }, []);

  const getEffectiveSize = useCallback(() => {
    const node = childNodeRef.current;
    const measured = node ? node.getBoundingClientRect() : null;
    const width = sizeRef.current.width ?? Math.round(measured?.width || 0);
    const height = sizeRef.current.height ?? Math.round(measured?.height || 0);
    return { width, height };
  }, []);

  const emitStop = useCallback((event, nextX, nextY) => {
    if (typeof onStop !== "function") return;
    onStop(event, {
      node: childNodeRef.current,
      x: nextX,
      y: nextY,
      deltaX: 0,
      deltaY: 0,
      lastX: nextX,
      lastY: nextY,
    });
  }, [onStop]);

  const startResize = useCallback((event, direction) => {
    if (disabled) return;
    event.stopPropagation();
    if (event.type === "mousedown") event.preventDefault();

    const point = getPoint(event);
    if (!point) return;

    const node = childNodeRef.current;
    if (!node) return;

    const { width, height } = getEffectiveSize();
    const startRect = {
      x: positionRef.current.x,
      y: positionRef.current.y,
      width,
      height,
    };

    // Focus behavior should match a normal window click/resume action.
    if (typeof onStart === "function") {
      onStart(event, { x: startRect.x, y: startRect.y });
    }

    // Keep ephemeral high-frequency resize data in refs so mousemove does not re-render each tick.
    resizeSessionRef.current = {
      direction,
      startX: point.clientX,
      startY: point.clientY,
      startRect,
      minWidth: windowSize.minWidth || DEFAULT_MIN_WIDTH,
      minHeight: windowSize.minHeight || DEFAULT_MIN_HEIGHT,
    };

    setResizeDirection(direction);
    setIsResizing(true);
    applyBodySelectionLock(true);
  }, [applyBodySelectionLock, disabled, getEffectiveSize, onStart, windowSize.minHeight, windowSize.minWidth]);

  useEffect(() => {
    if (!isResizing) return undefined;

    const handleMove = (event) => {
      const session = resizeSessionRef.current;
      if (!session) return;

      const point = getPoint(event);
      if (!point) return;
      if (event.type === "touchmove") event.preventDefault();

      const deltaX = point.clientX - session.startX;
      const deltaY = point.clientY - session.startY;
      const start = session.startRect;
      let nextX = start.x;
      let nextY = start.y;
      let nextWidth = start.width;
      let nextHeight = start.height;

      if (session.direction.includes("e")) nextWidth = start.width + deltaX;
      if (session.direction.includes("s")) nextHeight = start.height + deltaY;
      if (session.direction.includes("w")) {
        nextWidth = start.width - deltaX;
        nextX = start.x + deltaX;
      }
      if (session.direction.includes("n")) {
        nextHeight = start.height - deltaY;
        nextY = start.y + deltaY;
      }

      nextWidth = Math.max(session.minWidth, nextWidth);
      nextHeight = Math.max(session.minHeight, nextHeight);

      if (session.direction.includes("w")) {
        nextX = start.x + start.width - nextWidth;
      }
      if (session.direction.includes("n")) {
        nextY = start.y + start.height - nextHeight;
      }

      const viewportWidth = window.innerWidth || 0;
      const viewportHeight = window.innerHeight || 0;

      if (session.direction.includes("e")) {
        nextWidth = Math.min(nextWidth, viewportWidth - nextX);
      }
      if (session.direction.includes("s")) {
        nextHeight = Math.min(nextHeight, viewportHeight - nextY);
      }

      const maxX = Math.max(0, viewportWidth - nextWidth);
      const maxY = Math.max(0, viewportHeight - nextHeight);
      nextX = clamp(nextX, 0, maxX);
      nextY = clamp(nextY, 0, maxY);

      if (session.direction.includes("w")) {
        nextWidth = Math.max(session.minWidth, start.x + start.width - nextX);
      }
      if (session.direction.includes("n")) {
        nextHeight = Math.max(session.minHeight, start.y + start.height - nextY);
      }

      setWindowPosition({ x: nextX, y: nextY });
      setWindowSize((previous) => ({
        ...previous,
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
      }));
    };

    const stopResize = (event) => {
      const finalPosition = positionRef.current;
      resizeSessionRef.current = null;
      setIsResizing(false);
      setResizeDirection(null);
      applyBodySelectionLock(false);
      emitStop(event, finalPosition.x, finalPosition.y);
    };

    // Mouse/touch move must be bound to window so fast pointer movement cannot escape a tiny handle.
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopResize);
    };
  }, [applyBodySelectionLock, emitStop, isResizing]);

  useEffect(() => {
    if (!isDragging) return undefined;
    const clearDragState = () => {
      setIsDragging(false);
      applyBodySelectionLock(false);
    };
    window.addEventListener("mouseup", clearDragState);
    window.addEventListener("touchend", clearDragState);
    return () => {
      window.removeEventListener("mouseup", clearDragState);
      window.removeEventListener("touchend", clearDragState);
    };
  }, [applyBodySelectionLock, isDragging]);

  useEffect(() => {
    return () => {
      applyBodySelectionLock(false);
    };
  }, [applyBodySelectionLock]);

  const handleDragStart = useCallback((event, data) => {
    if (isResizing) return false;
    const point = getPoint(event);
    const node = childNodeRef.current;
    if (point && node) {
      const rect = node.getBoundingClientRect();
      const isInTopRightControlZone =
        point.clientY >= rect.top &&
        point.clientY <= rect.top + TITLEBAR_SAFE_ZONE &&
        point.clientX >= rect.right - TOP_RIGHT_CONTROL_GUTTER &&
        point.clientX <= rect.right;
      if (isInTopRightControlZone) return false;
    }
    setIsDragging(true);
    applyBodySelectionLock(true);
    if (typeof onStart === "function") {
      return onStart(event, data);
    }
    return undefined;
  }, [applyBodySelectionLock, isResizing, onStart]);

  const handleDrag = useCallback((event, data) => {
    if (isResizing) return false;
    const { width, height } = getEffectiveSize();
    const clamped = clampWindowPosition(data.x, data.y, width, height);
    setWindowPosition(clamped);
    if (typeof onDrag === "function") {
      onDrag(event, { ...data, x: clamped.x, y: clamped.y });
    }
    return undefined;
  }, [getEffectiveSize, isResizing, onDrag]);

  const handleDragStop = useCallback((event, data) => {
    const { width, height } = getEffectiveSize();
    const clamped = clampWindowPosition(data.x, data.y, width, height);
    setWindowPosition(clamped);
    setIsDragging(false);
    applyBodySelectionLock(false);
    emitStop(event, clamped.x, clamped.y);
  }, [applyBodySelectionLock, emitStop, getEffectiveSize]);

  const childRef = children.ref;
  const attachChildRef = useCallback((node) => {
    childNodeRef.current = node;
    if (typeof childRef === "function") {
      childRef(node);
    } else if (childRef && typeof childRef === "object") {
      childRef.current = node;
    }
  }, [childRef]);

  const mergedChildStyle = useMemo(() => {
    const previousStyle = children.props.style || {};
    const duringInteraction = isDragging || isResizing;
    const nextMinWidth = resolveMinDimension(previousStyle.minWidth, DEFAULT_MIN_WIDTH);
    const nextMinHeight = resolveMinDimension(previousStyle.minHeight, DEFAULT_MIN_HEIGHT);
    return {
      ...previousStyle,
      width: !disabled && windowSize.width ? windowSize.width : previousStyle.width,
      height: !disabled && windowSize.height ? windowSize.height : previousStyle.height,
      minWidth: Math.max(DEFAULT_MIN_WIDTH, nextMinWidth),
      minHeight: Math.max(DEFAULT_MIN_HEIGHT, nextMinHeight),
      resize: "none",
      willChange: duringInteraction ? "transform, width, height" : previousStyle.willChange,
      transition: duringInteraction ? "none" : previousStyle.transition,
    };
  }, [children.props.style, disabled, isDragging, isResizing, windowSize.height, windowSize.width]);

  const childWithHandles = React.cloneElement(children, {
    ref: attachChildRef,
    style: mergedChildStyle,
    children: (
      <>
        {children.props.children}
        <ResizeHandle direction="n" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="s" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="e" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="w" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="ne" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="nw" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="se" disabled={disabled} onStartResize={startResize} />
        <ResizeHandle direction="sw" disabled={disabled} onStartResize={startResize} />
      </>
    ),
  });

  const showInteractionOverlay = isDragging || isResizing;
  const overlayCursor = isResizing ? RESIZE_CURSORS[resizeDirection] || "default" : "move";

  return (
    <>
      {/* iframes can swallow mouse events; this fixed overlay keeps drag/resize interactions reliable */}
      {showInteractionOverlay ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: OVERLAY_Z_INDEX,
            cursor: overlayCursor,
            background: "transparent",
          }}
        />
      ) : null}
      {/* During resize, the overlay also locks cursor style so it does not flicker across nested elements. */}
      <Draggable
        ref={ref}
        {...rest}
        handle={handle}
        cancel={mergedCancelSelector}
        disabled={disabled || isResizing}
        position={windowPosition}
        onStart={handleDragStart}
        onDrag={handleDrag}
        onStop={handleDragStop}
      >
        {childWithHandles}
      </Draggable>
    </>
  );
});

export default WindowDraggable;
