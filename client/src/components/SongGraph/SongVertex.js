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
        r={
          props.radius *
          Math.max(
            props.hover === props.track.track.id ? props.hoverMultiplier : 1,
            props.selected.songs.includes(props.track.track.id)
              ? props.selectedMultiplier
              : 1
          )
        }
        fill={props.data.color}
      />
    </g>
  );
};

SongVertex.defaultProps = {
  radius: 1,
  hoverMultiplier: 2,
  selectedMultiplier: 1.5,
};

export default SongVertex;
