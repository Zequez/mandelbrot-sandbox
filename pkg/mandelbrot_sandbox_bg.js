import * as wasm from './mandelbrot_sandbox_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {number} x
* @param {number} y
* @param {number} iterations
* @param {number} radius
* @returns {number}
*/
export function mandelbrot(x, y, iterations, radius) {
    var ret = wasm.mandelbrot(x, y, iterations, radius);
    return ret;
}

/**
*/
export class Mandelbrot {

    static __wrap(ptr) {
        const obj = Object.create(Mandelbrot.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mandelbrot_free(ptr);
    }
    /**
    * @param {number} res_x
    * @param {number} res_y
    * @param {Palette} palette
    * @returns {Mandelbrot}
    */
    static new(res_x, res_y, palette) {
        _assertClass(palette, Palette);
        var ptr0 = palette.ptr;
        palette.ptr = 0;
        var ret = wasm.mandelbrot_new(res_x, res_y, ptr0);
        return Mandelbrot.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} focus_x
    * @param {number} focus_y
    * @param {number} iterations
    */
    render(x, y, focus_x, focus_y, iterations) {
        wasm.mandelbrot_render(this.ptr, x, y, focus_x, focus_y, iterations);
    }
    /**
    * @returns {number}
    */
    pixels() {
        var ret = wasm.mandelbrot_pixels(this.ptr);
        return ret;
    }
}
/**
*/
export class Palette {

    static __wrap(ptr) {
        const obj = Object.create(Palette.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_palette_free(ptr);
    }
    /**
    * @returns {Palette}
    */
    static new() {
        var ret = wasm.palette_new();
        return Palette.__wrap(ret);
    }
}

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

