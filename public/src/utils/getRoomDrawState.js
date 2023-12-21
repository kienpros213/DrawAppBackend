"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomDrawState = void 0;
function getRoomDrawState(roomDrawState, payload) {
    if (!roomDrawState[payload.room]) {
        roomDrawState[payload.room] = {};
    }
    if (!roomDrawState[payload.room][payload.tool]) {
        roomDrawState[payload.room][payload.tool] = [];
    }
    return roomDrawState;
}
exports.getRoomDrawState = getRoomDrawState;
//# sourceMappingURL=getRoomDrawState.js.map