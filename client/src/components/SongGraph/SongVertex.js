import React, { useState } from 'react';

const SongVertex = props => {
  const [active, setActive] = useState(false);

  let fill = Math.min(props.total / props.targetBallDensity, 0.9);
  let theta = (2 * Math.PI * props.index) / props.total;
  let r =
    (1 - 2 * props.radius) *
    Math.sqrt(
      (fill *
        ((props.index -
          (props.index * (props.total % props.turnAngle)) / props.total) %
          props.turnAngle)) /
        props.turnAngle +
        (1 - fill)
    );
  return (
    <g
      className={'SongVertex' + (active ? ' center' : '')}
      id={props.track.track.id}
      transform={`translate(${r * Math.cos(theta)}, ${r * Math.sin(theta)})`}
      onMouseEnter={() => props.setHover(props.track.track.id)}
    >
      <circle className="ball" r={props.radius} fill={props.track.color} />
    </g>
  );
};

SongVertex.defaultProps = {
  radius: 0.02,
  targetBallDensity: 1000,
  turnAngle: (1 + Math.sqrt(5)) / 2,
  lineWidth: 2,
  centerFontSize: 24,
};

export default SongVertex;
