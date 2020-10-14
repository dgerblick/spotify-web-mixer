import React from 'react';

const SongVertex = props => {
  return (
    <g
      className="SongVertex"
      onMouseEnter={() => props.setHover(props.track.track.id)}
    >
      <circle
        id={props.track.track.id}
        className="ball"
        cx={props.data.pos.x}
        cy={props.data.pos.y}
        r={props.radius * (props.hover === props.track.track.id ? 2 : 1)}
        fill={props.data.color}
      />
    </g>
  );
};

export default SongVertex;
