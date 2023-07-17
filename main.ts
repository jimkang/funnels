import './app.css';
import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import seedrandom from 'seedrandom';
import RandomId from '@jimkang/randomid';
import { createProbable as Probable } from 'probable';
import { range } from 'd3-array';
import { FunnelDef, Pt } from './types';
import { renderFunnels } from './renderers/render-funnels';

var randomId = RandomId();
var prob: any;
var routeState: any;

(async function go() {
  window.onerror = reportTopLevelError;
  renderVersion();

  routeState = RouteState({
    followRoute,
    windowObject: window,
    // propsToCoerceToBool: ['enableFeedback'],
  });
  routeState.routeFromHash();
})();

async function followRoute({
  seed,
  funnelCount,
  boardWidth = 1400,
  boardHeight = 1400,
}: {
  seed: string;
  funnelCount: number;
  boardWidth: number;
  boardHeight: number;
}) {
  if (!seed) {
    routeState.addToRoute({ seed: randomId(8) });
    return;
  }
  if (!funnelCount) {
    routeState.addToRoute({ funnelCount: 1 });
  }

  var random = seedrandom(seed);
  prob = Probable({ random });
  prob.roll(2);

  var funnelDefs: FunnelDef[] = range(funnelCount).map(() => ({
    id: `funnel-${randomId(4)}`,
    axialPath: createAxialPath({ pointCount: 10 }),
  }));

  renderFunnels({ funnelDefs });

  function createAxialPath({
    pointCount,
    maxAngleChange = Math.PI / 3,
  }: {
    pointCount: number;
    maxAngleChange: number;
  }): Pt[] {
    var path = [];
    var lastPt: Pt = { x: 0, y: 0 };
    var pointGapDist = (boardWidth + boardHeight) / 2 / 20;
    var lastTheta = prob.roll(2 * Math.PI * 100) / 100;

    for (let i = 0; i < pointCount; ++i) {
      if (i === 0) {
        lastPt = { x: prob.roll(boardWidth), y: prob.roll(boardHeight) };
      } else {
        lastTheta +=
          (prob.pick([-1, 1]) * prob.roll(maxAngleChange * 100)) / 100;
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
}

function reportTopLevelError(
  _msg: any,
  _url: any,
  _lineNo: any,
  _columnNo: any,
  error: any
) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info') as HTMLElement;
  versionInfo.textContent = version;
}
