"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatArrayBuffer = void 0;
function concatArrayBuffer(...buffers) {
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const result = new ArrayBuffer(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
        const view = new Uint8Array(result, offset, buffer.byteLength);
        view.set(new Uint8Array(buffer));
        offset += buffer.byteLength;
    }
    return result;
}
exports.concatArrayBuffer = concatArrayBuffer;
//# sourceMappingURL=concatArrayBuffer.js.map