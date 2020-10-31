/* tslint:disable */
/* eslint-disable */
/**
* @param {number} x
* @param {number} y
* @param {number} iterations
* @param {number} radius
* @returns {number}
*/
export function mandelbrot(x: number, y: number, iterations: number, radius: number): number;
/**
*/
export class Mandelbrot {
  free(): void;
/**
* @param {number} res_x
* @param {number} res_y
* @param {Palette} palette
* @returns {Mandelbrot}
*/
  static new(res_x: number, res_y: number, palette: Palette): Mandelbrot;
/**
* @param {number} x
* @param {number} y
* @param {number} focus_x
* @param {number} focus_y
* @param {number} iterations
*/
  render(x: number, y: number, focus_x: number, focus_y: number, iterations: number): void;
/**
* @returns {number}
*/
  pixels(): number;
}
/**
*/
export class Palette {
  free(): void;
/**
* @returns {Palette}
*/
  static new(): Palette;
}
