const ITERATIONS: u32 = 20;
const GOLDEN_RATIO: f64 = 1.61;
const RADIUS_OF_NO_RETURN: f64 = 2.0;
const PX_W: u32 = 14;
const PX_H: u32 = 30;
const BLOCKS: u32 = 110; // Horizontal blocks of text
const LINES: u32 = ((BLOCKS * PX_W) as f64 / GOLDEN_RATIO / PX_H as f64) as u32; // Vertical lines
const WIDTH: u32 = PX_W * BLOCKS; // Screen width
const HEIGHT: u32 = PX_H * LINES; // Screen height
const VIEWPORT_W: f64 = 4.0; // Virtual plot width
const VIEWPORT_X: f64 = -2.0; // Virtual plot height
const RATIO: f64 = VIEWPORT_W as f64 / WIDTH as f64;
const VIEWPORT_H: f64 = HEIGHT as f64 * RATIO;
const VIEWPORT_Y: f64 = -VIEWPORT_H / 2.0;

// Z ^ 2 + C
fn mandelbrot(x: f64, y: f64) -> u16 {
    let mut it = 0;
    let mut a: f64 = 0.0;
    let mut b: f64 = 0.0;
    let mut a2: f64 = 0.0;
    let mut b2: f64 = 0.0;

    while it < ITERATIONS && a2 + b2 < RADIUS_OF_NO_RETURN * RADIUS_OF_NO_RETURN {
        //  Z = (a + bi)
        // C = (x + yi)
        // Z^2 + C

        b = 2.0 * a * b + y;
        a = a2 - b2 + x;
        a2 = a * a;
        b2 = b * b;
        it = it + 1;
    }
    ((it as f64 / ITERATIONS as f64) * 9.0).round() as u16
}

const CHARACTERS: [char; 10] = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];

fn main() {
    println!("╔{}╗", "═".repeat(BLOCKS as usize));
    for line in 0..LINES {
        let mut buf = String::from("");
        let pos_y: f64 = (line * PX_H) as f64 + PX_H as f64 / 2.0;
        let y: f64 = pos_y * RATIO + VIEWPORT_Y;

        for block in 0..BLOCKS {
            let pos_x: f64 = (block * PX_W) as f64 + PX_W as f64 / 2.0;
            let x: f64 = pos_x * RATIO + VIEWPORT_X;

            // let i: u32 = ((x * x + y * y).sqrt() / RADIUS_OF_NO_RETURN * 9.0) as u32;
            // if i <= 9 {
            //     buf.push(CHARACTERS[i as usize]);
            // } else {
            //     buf.push(CHARACTERS[9]);
            // }

            let i = mandelbrot(x, y);
            if i <= 9 {
                buf.push(CHARACTERS[9 - i as usize]);
            } else {
                panic!("Function should return value from 0 to 9");
            }
        }

        println!("║{}║", buf);
    }
    println!("╚{}╝", "═".repeat(BLOCKS as usize));
}
