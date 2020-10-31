import React, { useRef, useEffect } from "react";
import { Mandelbrot, Palette } from "mandelbrot-sandbox";
import { memory } from "mandelbrot-sandbox/mandelbrot_sandbox_bg.wasm";
import { orPanic } from "./utils";

const palette = Palette.new();

interface MandelbrotRendererProps {
  resDX: number;
  resDY: number;
  centerX: number;
  centerY: number;
  focusDX: number;
  focusDY: number;
  iterations: number;
}

const MandelbrotRenderer: React.FC<MandelbrotRendererProps> = ({
  resDX,
  resDY,
  centerX,
  centerY,
  focusDX,
  focusDY,
  iterations,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = orPanic(canvasRef.current.getContext("2d"));

      // // Adjust resolutions
      // if (resDX == null) {
      //   resDX = Math.floor(canvasRef.current.clientWidth * (autoRes ?? 1));
      // }
      // if (resDY == null) {
      //   resDY = Math.floor(canvasRef.current.clientHeight * (autoRes ?? 1));
      // }
      // if (focusDY == null) {
      //   focusDY = (resDY / resDX) * focusDX;
      // }

      canvasRef.current.width = resDX;
      canvasRef.current.height = resDY;

      mandelbrotImageData(
        resDX,
        resDY,
        focusDX,
        focusDY,
        centerX,
        centerY,
        iterations,
        (imageData) => {
          ctx.putImageData(imageData, 0, 0);
        }
      );
    }
  }, [resDX, resDY, focusDX, focusDY, centerX, centerY, iterations]);

  return (
    <canvas
      {...rest}
      style={{ height: "100%", width: "100%" }}
      ref={canvasRef}
    ></canvas>
  );
};

function mandelbrotImageData(
  resDX: number,
  resDY: number,
  focusDX: number,
  focusDY: number,
  centerX: number,
  centerY: number,
  iterations: number,
  cb: (imageData: ImageData) => void
) {
  const universe = Mandelbrot.new(resDX, resDY, Palette.new());
  universe.render(centerX, centerY, focusDX, focusDY, iterations);

  const pixels = new Uint8ClampedArray(
    memory.buffer,
    universe.pixels(),
    resDX * resDY * 4
  );
  cb(new ImageData(pixels, resDX, resDY));
  universe.free();
}

export default MandelbrotRenderer;
