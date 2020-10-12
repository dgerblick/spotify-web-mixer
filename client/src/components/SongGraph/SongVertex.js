import React from 'react';

const SongVertex = props => {
  console.log(props.track.color);
  return (
    <circle
      cx={Math.random() * 200 - 100}
      cy={Math.random() * 200 - 100}
      r={1}
      fill={props.track.color}
    />
  );
};

export default SongVertex;
