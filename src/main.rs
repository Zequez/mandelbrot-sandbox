// use terminal_size::{terminal_size, Height, Width};

// const ITERATIONS: u32 = 20;
// const GOLDEN_RATIO: f64 = 1.61;
// const RADIUS_OF_NO_RETURN: f64 = 2.0;
// const PX_W: u32 = 14;
// const PX_H: u32 = 30;
// const COLS: u32 = 110; // Horizontal blocks of text
// const ROWS: u32 = ((COLS * PX_W) as f64 / GOLDEN_RATIO / PX_H as f64) as u32; // Vertical lines

// // Z ^ 2 + C
// fn mandelbrot(x: f64, y: f64) -> u32 {
//     let mut it = 0;
//     let mut a: f64 = 0.0;
//     let mut b: f64 = 0.0;
//     let mut a2: f64 = 0.0;
//     let mut b2: f64 = 0.0;

//     while it < ITERATIONS && a2 + b2 < RADIUS_OF_NO_RETURN * RADIUS_OF_NO_RETURN {
//         //  Z = (a + bi)
//         // C = (x + yi)
//         // Z^2 + C

//         b = 2.0 * a * b + y;
//         a = a2 - b2 + x;
//         a2 = a * a;
//         b2 = b * b;
//         it = it + 1;
//     }
//     it
// }

// const CHARACTERS: [char; 10] = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];

// fn main() {
//     let size = terminal_size();
//     let mut cols: u32 = COLS;
//     let mut rows: u32 = ROWS;
//     if let Some((Width(wcols), Height(hrows))) = size {
//         cols = wcols as u32 - 2;
//         rows = hrows as u32 - 4;
//     } else {
//         println!("Unable to get terminal size");
//     }

//     let WIDTH: u32 = PX_W * cols; // Screen width
//     let HEIGHT: u32 = PX_H * rows; // Screen height
//     let VIEWPORT: (f64, f64) = (-0.1, 0.95); // Move the center of the plot
//     let VIEWPORT_WIDTH: f64 = 0.1; // Make this smaller for zoom
//     let RATIO: f64 = VIEWPORT_WIDTH / WIDTH as f64;
//     let VIEWPORT_HEIGHT: f64 = HEIGHT as f64 * RATIO;
//     let FROM_X: f64 = -(VIEWPORT_WIDTH / 2.0) + VIEWPORT.0;
//     let FROM_Y: f64 = -(VIEWPORT_HEIGHT / 2.0) + VIEWPORT.1;

//     println!("╔{}╗", "═".repeat(cols as usize));
//     for row in 0..rows {
//         let mut buf = String::from("");
//         let pos_y: f64 = (row * PX_H) as f64 + PX_H as f64 / 2.0;
//         let y: f64 = pos_y * RATIO + FROM_Y;

//         for col in 0..cols {
//             let pos_x: f64 = (col * PX_W) as f64 + PX_W as f64 / 2.0;
//             let x: f64 = pos_x * RATIO + FROM_X;

//             // let i: u32 = ((x * x + y * y).sqrt() / RADIUS_OF_NO_RETURN * 9.0) as u32;
//             // if i <= 9 {
//             //     buf.push(CHARACTERS[i as usize]);
//             // } else {
//             //     buf.push(CHARACTERS[9]);
//             // }

//             let iterations = mandelbrot(x, y);
//             let depth = ((iterations as f64 / ITERATIONS as f64) * 9.0).round() as usize;
//             if depth <= 9 {
//                 buf.push(CHARACTERS[9 - depth]);
//             } else {
//                 panic!("Function should return value from 0 to 9");
//             }
//         }

//         println!("║{}║", buf);
//     }
//     println!("╚{}╝", "═".repeat(cols as usize));
// }
