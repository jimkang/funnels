import { select } from 'd3-selection';
import { line } from 'd3-shape';

var createAxialLinePath = line()
  .x((d) => d.x)
  .y((d) => d.y);

export function renderFunnels({ funnelDefs }) {
  var funnelsSel = select('.funnels-root')
    .selectAll('.funnel')
    .data(funnelDefs, (def) => def.id);

  funnelsSel.exit().remove();

  var newFunnelSel = funnelsSel.enter().append('g').classed('funnel', true);

  newFunnelSel.append('path').classed('axial-path', true);

  var currentFunnelSet = newFunnelSel.merge(funnelsSel);

  currentFunnelSet
    .selectAll('.axial-path')
    .datum(
      (def) => {
        // console.log('Setting data to', def.axialPath);
        return def.axialPath;
      },
      (def) => def.id
    )
    .attr('d', createAxialLinePath);
  // .attr('d', function (d) {
  //   console.log('getting path for', d);
  //   return createAxialLinePath(d);
  // });
}
