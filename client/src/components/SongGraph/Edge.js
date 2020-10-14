import React from 'react';

const Edge = props => {
  let x = props.to.pos.x - props.from.pos.x;
  let y = props.to.pos.y - props.from.pos.y;
  let xArc = x / 2 - y / 4;
  let yArc = y / 2 - x / 4;
  return (
    <path
      d={`M ${props.from.pos.x} ${props.from.pos.y} q ${xArc} ${yArc} ${x} ${y}`}
      stroke={props.to.color}
      strokeWidth={props.strokeWidth}
      fillOpacity={0}
    />
  );
};

Edge.defaultProps = {
  strokeWidth: 0.005,
};

export default Edge;
