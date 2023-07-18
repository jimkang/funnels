import { Ring, Pt } from '../types';

export function createAxialPath({
  pointCount,
  maxAngleChange = Math.PI / 3,
  minGapDelta = 5,
  maxGapDelta = 20,
  boardWidth,
  boardHeight,
  prob,
}: {
  pointCount: number;
  maxAngleChange?: number;
  minGapDelta?: number;
  maxGapDelta?: number;
  boardWidth: number;
  boardHeight: number;
  prob: any;
}): Pt[] {
  var path = [];
  var lastPt: Pt = { x: 0, y: 0 };
  var pointGapDist = pickFromRange({
    prob,
    min: minGapDelta,
    max: maxGapDelta,
  });
  //  (boardWidth + boardHeight) / 2 / 20;
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
      pointGapDist += pickFromRange({
        prob,
        min: minGapDelta,
        max: maxGapDelta,
      });
    }
    path.push(lastPt);
  }
  return path;
}

export function createRings({
  centers,
  radiusVarianceProportion = 0.1,
  radiusScaleFn = (t) => t * 10,
  strokeWidthScaleFn = (t) => t * 10,
  prob,
}: {
  centers: Pt[];
  radiusVarianceProportion?: number;
  radiusScaleFn?: (arg: number) => number;
  strokeWidthScaleFn?: (arg: number) => number;
  prob: any;
}): Ring[] {
  var ellipses: Ring[] = [];
  if (centers.length < 1) {
    return ellipses;
  }

  for (let i = 0; i < centers.length; ++i) {
    const t = i / centers.length;
    const baseRadius = radiusScaleFn(t);
    const radiusVarianceMax = baseRadius * radiusVarianceProportion;
    ellipses.push({
      center: Object.assign({}, centers[i]),
      rx: baseRadius + prob.roll(radiusVarianceMax),
      ry: baseRadius + prob.roll(radiusVarianceMax),
      strokeWidth: strokeWidthScaleFn(t),
    });
  }

  return ellipses;
}

// TODO: Put in probable.
function pickFromRange({
  prob,
  min,
  max,
  fineness = 0.1,
}: {
  prob: any;
  min: number;
  max: number;
  fineness?: number;
}) {
  return min + prob.roll((max - min) / fineness) * fineness;
}
