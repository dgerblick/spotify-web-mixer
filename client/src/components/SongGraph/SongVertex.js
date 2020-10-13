import React from 'react';

const SongVertex = props => {
  let fill = Math.min(props.total / props.targetBallDensity, 0.9);
  let theta = (2 * Math.PI * props.index) / props.total;
  let r =
    (1 - props.radius) *
    Math.sqrt(
      (fill *
        ((props.index -
          (props.index * (props.total % props.turnAngle)) / props.total) %
          props.turnAngle)) /
        props.turnAngle +
        (1 - fill)
    );

  return (
    <circle
      cx={r * Math.cos(theta)}
      cy={r * Math.sin(theta)}
      r={props.radius}
      fill={props.track.color}
    />
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
