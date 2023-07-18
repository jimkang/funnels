import { select } from 'd3-selection';
import { line } from 'd3-shape';

var createAxialLinePath = line()
  .x((d) => d.x)
  .y((d) => d.y);

export function renderFunnels({ funnelDefs, showAxes }) {
  var funnelsSel = select('.funnels-root')
    .selectAll('.funnel')
    .data(funnelDefs, (def) => def.id);

  funnelsSel.exit().remove();

  var newFunnelSel = funnelsSel.enter().append('g').classed('funnel', true);

  if (showAxes) {
    newFunnelSel
      .append('path')
      .classed('axial-path', true)
      .style('filter', 'url(#displacementFilter)');
  }

  var currentFunnelSel = newFunnelSel.merge(funnelsSel);

  if (showAxes) {
    currentFunnelSel
      .selectAll('.axial-path')
      .datum(
        (def) => {
          // console.log('Setting data to', def.axialPath);
          return def.axialPath;
        },
        (def) => def.id
      )
      .attr('d', createAxialLinePath);
  }

  var ringSel = currentFunnelSel.selectAll('.ring').data((def) => def.rings);

  ringSel.exit().remove();
  var newRingSel = ringSel.enter().append('ellipse').classed('ring', true);

  var currentRingSel = newRingSel.merge(ringSel);
  currentRingSel
    .attr('cx', (d) => d.center.x)
    .attr('cy', (d) => d.center.y)
    .attr('rx', (d) => d.rx)
    .attr('ry', (d) => d.ry)
    .attr('stroke-width', (d) => d.strokeWidth)
    .attr('stroke', (d) => d.color);
}
