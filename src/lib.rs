mod utils;
use std::f64::consts::PI;

use wasm_bindgen::prelude::*;
use std::convert::TryInto;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

const RADIUS_OF_NO_RETURN: f64 = 2.0;


#[wasm_bindgen]
pub struct Mandelbrot {
    pixels: Vec<u8>,
    res_x: u32,
    res_y: u32,
    palette: Palette
}

#[wasm_bindgen]
impl Mandelbrot {
    pub fn new(res_x: u32, res_y: u32, palette: Palette) -> Mandelbrot {
        Mandelbrot {
            res_x,
            res_y,
            palette,
            pixels: Vec::with_capacity((res_x * res_y * 4).try_into().unwrap())
        }
    }

    pub fn render(&mut self, x: f64, y: f64, focus_x: f64, focus_y: f64, iterations: i32) {
        self.pixels.clear();
        let ratio_x = focus_x / self.res_x as f64;
        let ratio_y = focus_y / self.res_y as f64;
        let depth_ratio = 255.0 / iterations as f64;
        for col in 0..self.res_y {
            for row in 0..self.res_x {
                let depth = (mandelbrot(
                    row as f64 * ratio_x + x - focus_x / 2.0,
                    col as f64 * ratio_y + y - focus_y / 2.0,
                    iterations,
                    RADIUS_OF_NO_RETURN,
                ) as f64
                    * depth_ratio) as usize;

                let color = if depth < 255 {
                    self.palette.colors[depth as usize]
                } else {
                    (0, 0, 0)
                };

                self.pixels.push(color.0);
                self.pixels.push(color.1);
                self.pixels.push(color.2);
                self.pixels.push(255);
            }
        }
    }

    pub fn pixels(&self) -> *const u8 {
        self.pixels.as_ptr()
    }
}

#[wasm_bindgen]
pub struct Palette {
    colors: [(u8, u8, u8); 255],
}

#[wasm_bindgen]
impl Palette {
    pub fn new() -> Palette {
        let mut palette: [(u8, u8, u8); 255] = [(0, 0, 0); 255];
        let redb = 2.0 * PI / (128.0);
        let redc = 256.0 * 0.25;
        let greenb = 2.0 * PI / ( 128.0);
        let greenc = 256.0 * 0.5;
        let blueb = 2.0 * PI / (128.0);
        let bluec = 256.0 * 0.75;
        for i in 0..255 {
            let r = (255.0 * (0.5 * (redb + i as f64 + redc).sin() + 0.5)) as u8;
            let g = (255.0 * (0.5 * (greenb + i as f64 + greenc).sin() + 0.5)) as u8;
            let b = (255.0 * (0.5 * (blueb + i as f64 + bluec).sin() + 0.5)) as u8;
            palette[i] = (r, g, b)
        }
        Palette {
            colors: palette
        }
    }
}

#[wasm_bindgen]
pub fn mandelbrot(x: f64, y: f64, iterations: i32, radius: f64) -> i32 {
    let mut it = 0;
    let mut a: f64 = 0.0;
    let mut b: f64 = 0.0;
    let mut a2: f64 = 0.0;
    let mut b2: f64 = 0.0;

    while it < iterations && a2 + b2 < radius * radius {
        //  Z = (a + bi)
        // C = (x + yi)
        // Z^2 + C

        b = 2.0 * a * b + x;
        a = a2 - b2 + y;
        a2 = a * a;
        b2 = b * b;
        it = it + 1;
    }
    it
}
