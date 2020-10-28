mod utils;

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
    cells: Vec<u8>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        let cells = (0..width * height * 4).map(|_| 0).collect();

        Universe {
            width,
            height,
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
                next.push(255);
                next.push(255);
                next.push(255);
                next.push(
                    (mandelbrot(
                        row as f64 * ratio_x + x,
                        col as f64 * ratio_y + y,
                        iterations,
                    ) as f64
                        * depth_ratio) as u8,
                );
            }
        }

        self.cells = next;
    }

    pub fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }
}

#[wasm_bindgen]
pub fn mandelbrot(x: f64, y: f64, iterations: i32) -> i32 {
    let mut it = 0;
    let mut a: f64 = 0.0;
    let mut b: f64 = 0.0;
    let mut a2: f64 = 0.0;
    let mut b2: f64 = 0.0;

    while it < iterations && a2 + b2 < RADIUS_OF_NO_RETURN * RADIUS_OF_NO_RETURN {
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
