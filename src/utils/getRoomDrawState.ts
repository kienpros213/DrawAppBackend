export function getRoomDrawState(roomDrawState, payload: any) {
  if (!roomDrawState[payload.room]) {
    roomDrawState[payload.room] = {};
  }

  if (!roomDrawState[payload.room][payload.tool]) {
    roomDrawState[payload.room][payload.tool] = [];
  }
  return roomDrawState;
}
