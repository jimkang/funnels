import './app.css';
import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import seedrandom from 'seedrandom';
import RandomId from '@jimkang/randomid';
import { createProbable as Probable } from 'probable';
import { FunnelDef } from './types';
import { renderFunnels } from './renderers/render-funnels';
import { createAxialPath, createRings } from './updaters/create-schmatics';
import { selectAll } from 'd3-selection';

var randomId = RandomId();
var prob: any;
var routeState: any;

(async function go() {
  window.onerror = reportTopLevelError;
  renderVersion();

  routeState = RouteState({
    followRoute,
    windowObject: window,
    propsToCoerceToBool: ['showAxes', 'showText'],
  });
  routeState.routeFromHash();
})();

async function followRoute({
  seed,
  funnelCount,
  funnelSegmentCount = 50,
  boardWidth = 1400,
  boardHeight = 1400,
  showAxes = false,
  showText = false,
}: {
  seed: string;
  funnelSegmentCount: number;
  funnelCount: number;
  boardWidth: number;
  boardHeight: number;
  showAxes: boolean;
  showText: boolean;
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

  var funnelDefs: FunnelDef[] = [];

  for (let i = 0; i < funnelCount; ++i) {
    let axialPath = createAxialPath({
      pointCount: funnelSegmentCount,
      minGapDelta: 0.5,
      maxGapDelta: 2.5,
      boardWidth,
      boardHeight,
      prob,
    });

    funnelDefs.push({
      id: `funnel-${randomId(4)}`,
      axialPath,
      rings: createRings({
        centers: axialPath,
        radiusVarianceProportion: 0.3,
        radiusScaleFn(t) {
          // https://www.desmos.com/calculator/giqt6h2ppf
          const phases = 4;
          const minRadius = 10;
          const multiplier = 5;
          // Make the first one really big, and the rest smaller than that.
          const multiplierExp = i === 0 ? 4 : 3;
          const a = Math.sin(2 * Math.PI * t * phases) / 8 + 2 * t;
          return minRadius + Math.pow(multiplier, multiplierExp) * a;
        },
        strokeWidthScaleFn(t) {
          const minWidth = 0.5;
          const maxWidth = 8;
          return minWidth + (maxWidth - minWidth) * t * t * t * t;
        },
        colorScaleFn(t) {
          const hueFloor = (100 + i * 4) % 360;
          const hueCeiling = (290 + i * 4) % 360;

          // Yellow center to blue outer cone
          // const hueFloor = (200 + i * 4) % 360;
          // const hueCeiling = (40 + i * 4) % 360;

          // Purple
          // const hueFloor = (200 + i * 4) % 360;
          // const hueCeiling = (340 + i * 4) % 360;

          // const minSat = 70;
          // const maxSat = 80;
          const minLightness = 35;
          const maxLightness = 45;
          return `hsl(${hueFloor + t * (hueCeiling - hueFloor)}, ${
            // minSat + (maxSat - minSat) * t
            60
          }%, ${
            minLightness +
            (maxLightness - minLightness) * (Math.sin(2 * Math.PI * t * 3) + t)
          }%)`;
        },
        prob,
      }),
    });
  }

  renderFunnels({ funnelDefs, showAxes });
  selectAll('.text').classed('hidden', !showAxes);
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
