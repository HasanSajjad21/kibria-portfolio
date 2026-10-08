import { Fragment } from 'react';
import type { FlowNodeSpec } from '@/data/stories';
import { flowIcons } from './flow-icons';

/** One box of a flow diagram: icon + label (+ optional small caption). */
export function FlowNode({ node }: { node: FlowNodeSpec }) {
  const lines = node.label.split('\n');
  return (
    <div className="fn" data-k={node.key} style={node.area ? { gridArea: node.area } : undefined}>
      {flowIcons[node.icon]}
      <span className="fn-tx">
        <b>
          {lines.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {l}
            </Fragment>
          ))}
        </b>
        {node.sub && <small>{node.sub}</small>}
      </span>
    </div>
  );
}
