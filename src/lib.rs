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

#[wasm_bindgen]
pub fn greet(name: &str) {
    // let a = format!("Hello, {}!", name).as_str();
    alert(&format!("Hello, {}!", name));
}

const RADIUS_OF_NO_RETURN: f64 = 2.0;

#[wasm_bindgen]
pub fn mandelbrot(x: f64, y: f64, iterations: u32) -> u32 {
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
