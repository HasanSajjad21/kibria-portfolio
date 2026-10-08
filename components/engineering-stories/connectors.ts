/** Connector routing for the flow diagrams, from the nodes' real (unscaled) layout boxes. */

export interface Box { x: number; y: number; w: number; h: number }
export type EdgeKind = 'h' | 'b' | 'd';

export const boxOf = (el: HTMLElement): Box => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

const R = 10; // corner radius

export function route(A: Box, B: Box, kind: EdgeKind) {
  if (kind === 'h') {
    // straight: right edge of A → left edge of B
    const y = A.y + A.h / 2;
    return `M${A.x + A.w + 3},${y} H${B.x - 5}`;
  }
  if (kind === 'b') {
    // branch: right, then up/down, then right into B
    const x1 = A.x + A.w + 3, y1 = A.y + A.h / 2, y2 = B.y + B.h / 2, mx = (A.x + A.w + B.x) / 2, s = y2 > y1 ? 1 : -1;
    return `M${x1},${y1} H${mx - R} Q${mx},${y1} ${mx},${y1 + s * R} V${y2 - s * R} Q${mx},${y2} ${mx + R},${y2} H${B.x - 5}`;
  }
  // drop: down from A, across, down into the top of B
  const x1 = A.x + A.w / 2, y1 = A.y + A.h + 3, x2 = B.x + B.w / 2, y2 = B.y - 5, my = (A.y + A.h + B.y) / 2, s = x2 < x1 ? -1 : 1;
  return `M${x1},${y1} V${my - R} Q${x1},${my} ${x1 + s * R},${my} H${x2 - s * R} Q${x2},${my} ${x2},${my + R} V${y2}`;
}
