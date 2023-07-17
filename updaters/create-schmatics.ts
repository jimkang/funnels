import { Pt } from '../types';

export function createAxialPath({
  pointCount,
  maxAngleChange = Math.PI / 3,
  boardWidth,
  boardHeight,
  prob,
}: {
  pointCount: number;
  maxAngleChange?: number;
  boardWidth: number;
  boardHeight: number;
  prob: any;
}): Pt[] {
  var path = [];
  var lastPt: Pt = { x: 0, y: 0 };
  var pointGapDist = (boardWidth + boardHeight) / 2 / 20;
  var lastTheta = prob.roll(2 * Math.PI * 100) / 100;

  for (let i = 0; i < pointCount; ++i) {
    if (i === 0) {
      lastPt = { x: prob.roll(boardWidth), y: prob.roll(boardHeight) };
    } else {
      lastTheta += (prob.pick([-1, 1]) * prob.roll(maxAngleChange * 100)) / 100;
      lastPt = {
        x: lastPt.x + pointGapDist * Math.cos(lastTheta),
        y: lastPt.y + pointGapDist * Math.sin(lastTheta),
      };
      pointGapDist += (prob.rollDie(5) + 10) / 10;
    }
    path.push(lastPt);
  }
  return path;
}
