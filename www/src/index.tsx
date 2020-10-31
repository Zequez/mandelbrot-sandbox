import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MandelbrotRenderer from "./MandelbrotRenderer";

interface MandelbrotExplorerProps {}

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

const MandelbrotExplorer: React.FC<MandelbrotExplorerProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<null | DragState>(null);
  const [mandelbrot, setMandelbrot] = useState<null | MandelbrotState>(null);
  const [zoomStack, setZoomStack] = useState<ZoomHistory[]>([]);

  useEffect(() => {
    if (containerRef.current != null) {
      const resDX = containerRef.current.clientWidth;
      const resDY = containerRef.current.clientHeight;
      const focusDX = INITIAL_FOCUS_DX;

      setMandelbrot({
        resDX,
        resDY,
        centerX: INITIAL_CENTER_X,
        centerY: INITIAL_CENTER_Y,
        focusDX,
        focusDY: (resDY / resDX) * focusDX,
        iterations: 100,
      });
    }
  }, []);

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
        setMandelbrot({
          ...mandelbrot,
          centerX: centerX - (focusDX / resDX) * dragDX,
          centerY: centerY - (focusDY / resDY) * dragDY,
        });
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
          setMandelbrot({
            ...mandelbrot,
            focusDX: dx,
            focusDY: dy,
            centerX: centerX - focusDX / 2 + startX * ratioX + dx / 2,
            centerY: centerY - focusDY / 2 + startY * ratioY + dy / 2,
          });
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

  const [dragDX, dragDY] = dragD();
  const [zoomStartX, zoomStartY, zoomEndX, zoomEndY] = zoomD();

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
            absolute inset-x-0 bottom-0 mb-4 ml-4 mr-4 p-2
            rounded-md bg-black bg-opacity-50 text-white"
        >
          Iterations:
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
          {zoomStack.length > 0 ? (
            <button
              className="bg-white rounded-sm text-black px-4 float-right"
              onClick={() => zoomBackOut()}
            >
              Zoom back out
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

ReactDOM.render(<MandelbrotExplorer />, document.getElementById("root"));
