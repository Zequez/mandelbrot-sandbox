mod utils;
use std::f64::consts::PI;

use wasm_bindgen::prelude::*;

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
pub struct Universe {
    width: u32,
    height: u32,
    palette: [(u8, u8, u8); 255],
    cells: Vec<u8>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        let cells = (0..width * height * 4).map(|_| 0).collect();

        let mut palette: [(u8, u8, u8); 255] = [(0, 0, 0); 255];

        let redb = 2.0 * PI / (30.0 + 128.0);
        let redc = 256.0 * 0.88;
        let greenb = 2.0 * PI / (80.0 + 128.0);
        let greenc = 256.0 * 0.22;
        let blueb = 2.0 * PI / (10.0 + 128.0);
        let bluec = 256.0 * 0.44;
        for i in 0..255 {
            let r = (255.0 * (0.5 * (redb + i as f64 + redc).sin() + 0.5)) as u8;
            let g = (255.0 * (0.5 * (greenb + i as f64 + greenc).sin() + 0.5)) as u8;
            let b = (255.0 * (0.5 * (blueb + i as f64 + bluec).sin() + 0.5)) as u8;
            palette[i] = (r, g, b)
        }

        Universe {
            width,
            height,
            palette,
            cells,
        }
    }

    pub fn cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    pub fn render(&mut self, vpw: f64, vph: f64, x: f64, y: f64, iterations: i32) {
        let mut next: Vec<u8> = Vec::new();
        let ratio_x = vpw / self.width as f64;
        let ratio_y = vph / self.height as f64;
        println!("{}", ratio_x);
        let depth_ratio = 255.0 / iterations as f64;

        for col in 0..self.height {
            for row in 0..self.width {
                // let idx = self.get_index(row, col);
                let depth = (mandelbrot(
                    row as f64 * ratio_x + x,
                    col as f64 * ratio_y + y,
                    iterations,
                    RADIUS_OF_NO_RETURN,
                ) as f64
                    * depth_ratio) as usize;

                let color = if depth < 255 {
                    self.palette[depth as usize]
                } else {
                    (0, 0, 0)
                };

                // let color = HSL {
                //     h: depth,
                //     s: 0.7_f64,
                //     l: 0.5_f64,
                // }
                // .to_rgb();
                next.push(color.0);
                next.push(color.1);
                next.push(color.2);
                next.push(255);
            }
        }

        self.cells = next;
    }

    pub fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
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
