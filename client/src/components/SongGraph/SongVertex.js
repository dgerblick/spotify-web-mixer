import React, { useState } from 'react';

const SongVertex = props => {
  const [timer, setTimer] = useState(null);

  return (
    <g
      className="SongVertex"
      onMouseEnter={() => {
        setTimer(setTimeout(() => props.setHover(props.track.track.id), 100));
      }}
      onMouseLeave={() => {
        clearTimeout(timer);
        setTimer(null);
      }}
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
