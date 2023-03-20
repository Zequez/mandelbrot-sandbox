import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MandelbrotRenderer from "./MandelbrotRenderer";

interface MandelbrotExplorerProps {
  initialCenterX?: number;
  initialCenterY?: number;
  initialFocusDX?: number;
}

enum DragMode {
  Move = 1,
  Zoom,
}

type DragState = {
  mode: DragMode;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type MandelbrotState = {
  resDX: number;
  resDY: number;
  centerX: number;
  centerY: number;
  focusDX: number;
  focusDY: number;
  iterations: number;
};

type ZoomHistory = {
  centerX: number;
  centerY: number;
  focusDX: number;
  focusDY: number;
};

const INITIAL_CENTER_X = 0;
const INITIAL_CENTER_Y = -0.7;
const INITIAL_FOCUS_DX = 2.5;
const INITIAL_ITERATIONS = 200;

const MandelbrotExplorer: React.FC<MandelbrotExplorerProps> = ({
  initialCenterX,
  initialCenterY,
  initialFocusDX,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<null | DragState>(null);
  const [mandelbrot, setMandelbrot] = useState<null | MandelbrotState>(null);
  const [zoomStack, setZoomStack] = useState<ZoomHistory[]>([]);

  useEffect(initializeMandelbrot, []);

  function initializeMandelbrot() {
    if (containerRef.current != null) {
      const resDX = containerRef.current.clientWidth;
      const resDY = containerRef.current.clientHeight;
      const focusDX = initialFocusDX ?? INITIAL_FOCUS_DX;

      if (resDY === 0 || resDX === 0) {
        setTimeout(initializeMandelbrot, 100);
        return;
      }

      setMandelbrot({
        resDX,
        resDY,
        centerX: initialCenterX ?? INITIAL_CENTER_X,
        centerY: initialCenterY ?? INITIAL_CENTER_Y,
        focusDX,
        focusDY: (resDY / resDX) * focusDX,
        iterations: INITIAL_ITERATIONS,
      });
    }
  }

  function goToStart() {
    if (mandelbrot != null) {
      const { resDX, resDY } = mandelbrot;
      const focusDX = INITIAL_FOCUS_DX;

      setMandelbrot({
        resDX,
        resDY,
        centerX: INITIAL_CENTER_X,
        centerY: INITIAL_CENTER_Y,
        focusDX,
        focusDY: (resDY / resDX) * focusDX,
        iterations: INITIAL_ITERATIONS,
      });
    }
  }

  function onDragStart(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (ev.button === 0 || ev.button === 1) {
      setDragging({
        mode: ev.button === 0 ? DragMode.Zoom : DragMode.Move,
        startX: ev.clientX,
        startY: ev.clientY,
        endX: ev.clientX,
        endY: ev.clientY,
      });
    }
  }

  function onDragProgress(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (dragging != null) {
      setDragging({ ...dragging, endX: ev.clientX, endY: ev.clientY });
    }
  }

  function onDragEnd(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (mandelbrot != null) {
      if (dragging?.mode === DragMode.Move) {
        const [dragDX, dragDY] = dragD();
        const { resDX, resDY, focusDX, focusDY, centerX, centerY } = mandelbrot;
        const newCenterX = centerX - (focusDX / resDX) * dragDX;
        const newCenterY = centerY - (focusDY / resDY) * dragDY;
        setMandelbrot({
          ...mandelbrot,
          centerX: newCenterX,
          centerY: newCenterY,
        });
        setHistory(newCenterX, newCenterY, focusDX);
      }

      if (dragging?.mode === DragMode.Zoom) {
        let [startX, startY, endX, endY] = zoomD();
        const { resDX, resDY, focusDX, focusDY, centerX, centerY } = mandelbrot;

        const ratioX = focusDX / resDX;
        const ratioY = focusDY / resDY;
        const aspectRatioXY = resDX / resDY;

        // This is awful, but it works
        // Zoom by maintaining the aspect ratio, and also the center
        let dPxX = endX - startX;
        let dPxY = endY - startY;
        const zoomAspectRatioXY = dPxX / dPxY;
        if (zoomAspectRatioXY > aspectRatioXY) {
          let diff = dPxY - dPxX / aspectRatioXY;
          startY += diff / 2;
          dPxY = dPxX / aspectRatioXY;
        } else {
          let diff = dPxX - dPxY * aspectRatioXY;
          startX += diff / 2;
          dPxX = dPxY * aspectRatioXY;
        }

        const dx = ratioX * dPxX;
        const dy = ratioY * dPxY;

        if (dPxX >= 2 && dPxY >= 2) {
          setZoomStack(
            zoomStack.concat([{ centerX, centerY, focusDX, focusDY }])
          );
          const newCenterX = centerX - focusDX / 2 + startX * ratioX + dx / 2;
          const newCenterY = centerY - focusDY / 2 + startY * ratioY + dy / 2;
          setMandelbrot({
            ...mandelbrot,
            focusDX: dx,
            focusDY: dy,
            centerX: newCenterX,
            centerY: newCenterY,
          });
          setHistory(newCenterX, newCenterY, dx);
        }
      }

      setDragging(null);
    }
  }

  function dragD() {
    return [
      dragging ? dragging.endX - dragging.startX : 0,
      dragging ? dragging.endY - dragging.startY : 0,
    ];
  }

  function zoomD() {
    if (dragging?.mode === DragMode.Zoom && mandelbrot !== null) {
      return [
        Math.min(dragging.startX, dragging.endX),
        Math.min(dragging.startY, dragging.endY),
        Math.max(dragging.startX, dragging.endX),
        Math.max(dragging.startY, dragging.endY),
      ];
    } else {
      return [0, 0, 0, 0];
    }
  }

  function zoomBackOut() {
    if (zoomStack.length > 0 && mandelbrot !== null) {
      const lastZoom = zoomStack.slice(-1)[0] as ZoomHistory;
      setZoomStack(zoomStack.slice(0, -1));
      setMandelbrot({ ...mandelbrot, ...lastZoom });
    }
  }

  function resetZoom() {
    if (mandelbrot !== null) {
      setZoomStack([]);
      goToStart();
    }
  }

  function setHistory(x: number, y: number, f: number) {
    window.history.replaceState(null, "", `#!x=${x}&y=${y}&f=${f}`);
  }

  const [dragDX, dragDY] = dragD();
  const [zoomStartX, zoomStartY, zoomEndX, zoomEndY] = zoomD();
  const isOnStart = INITIAL_FOCUS_DX == mandelbrot?.focusDX;

  return (
    <div className="absolute inset-0">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: dragging?.mode === DragMode.Move ? "grabbing" : "default",
        }}
        onMouseDown={onDragStart}
        onMouseMove={onDragProgress}
        onMouseUp={onDragEnd}
        onContextMenu={(ev) => {
          if (zoomStack.length > 0) {
            ev.preventDefault();
            zoomBackOut();
          }
        }}
      >
        <div
          className="h-full w-full"
          style={{
            transform:
              dragging?.mode === DragMode.Move
                ? `translate(${dragDX}px, ${dragDY}px)`
                : "",
          }}
        >
          {dragging?.mode === DragMode.Zoom ? (
            <div
              style={{
                border: "solid 1px red",
                position: "absolute",
                top: `${zoomStartY}px`,
                left: `${zoomStartX}px`,
                width: `${zoomEndX - zoomStartX}px`,
                height: `${zoomEndY - zoomStartY}px`,
              }}
            ></div>
          ) : null}

          {mandelbrot !== null ? <MandelbrotRenderer {...mandelbrot} /> : null}
        </div>
      </div>
      {mandelbrot !== null ? (
        <div
          className="
            absolute inset-x-0 bottom-0 p-2
            flex items-center
            bg-black bg-opacity-50 text-white"
        >
          Iterations:
          <button
            className="ml-2 px-2 rounded-sm bg-blue-500"
            onClick={() =>
              setMandelbrot({
                ...mandelbrot,
                iterations:
                  mandelbrot.iterations > 100
                    ? mandelbrot.iterations - 100
                    : 10,
              })
            }
          >
            -100
          </button>
          <input
            className="ml-2 rounded-sm w-16 text-black p-0 text-center"
            type="number"
            value={mandelbrot.iterations}
            onChange={(ev) =>
              setMandelbrot({
                ...mandelbrot,
                iterations: ev.target.valueAsNumber,
              })
            }
          />
          <button
            className="ml-2 px-2 rounded-sm bg-blue-500"
            onClick={() =>
              setMandelbrot({
                ...mandelbrot,
                iterations: mandelbrot.iterations + 100,
              })
            }
          >
            +100
          </button>
          <div className="text-xs ml-4">
            MClick = Drag; LDrag = Zoom; RClick = ZoomOut
          </div>
          <div className="flex-grow"></div>
          <div className="">
            {!isOnStart ? (
              <button
                className="px-2 rounded-sm bg-blue-500"
                onClick={resetZoom}
              >
                Reset zoom
              </button>
            ) : null}
            {zoomStack.length > 0 ? (
              <button
                className="ml-2 px-2 rounded-sm bg-blue-500"
                onClick={zoomBackOut}
              >
                Zoom back
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

let defaults: MandelbrotExplorerProps = {};
if (window?.location?.hash) {
  const queryString = window.location.hash
    .slice(2)
    .split("&")
    .reduce((all, val) => {
      let [k, v] = val.split("=");
      let n = parseFloat(v);
      if (!isNaN(n)) all[k] = n;
      return all;
    }, {} as { [key: string]: number });

  defaults = {
    initialCenterX: queryString?.x,
    initialCenterY: queryString?.y,
    initialFocusDX: queryString?.f,
  };
}

ReactDOM.render(
  <MandelbrotExplorer {...defaults} />,
  document.getElementById("root")
);
