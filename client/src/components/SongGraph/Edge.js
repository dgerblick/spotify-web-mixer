import React from 'react';

const Edge = props => {
  let pointA = props.from.pos.x + ' ' + props.from.pos.y;
  let pointMid =
    (props.from.pos.x + props.to.pos.x) / 4 +
    ' ' +
    (props.from.pos.y + props.to.pos.y) / 4;
  let pointB = props.to.pos.x + ' ' + props.to.pos.y;
  let path = `M ${pointA} L ${pointB}`;
  let randID = Math.floor(Math.random() * 0xffffffff).toString(16);
  return (
    <path
      d={path}
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
