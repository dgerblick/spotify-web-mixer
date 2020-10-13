import React, { useState } from 'react';
import SongVertex from './SongVertex';
import './index.scss';

const SongGraph = props => {
  let ballRadius = Math.max(0.02, (0.5 * Math.PI) / props.tracks?.ids.count);

  return (
    <svg
      className="SongGraph"
      viewBox="-1 -1 2 2"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.tracks?.ids.byCamelot.map((id, index) => (
        <SongVertex
          key={id}
          track={props.tracks.tracks[id]}
          index={index}
          total={props.tracks.ids.count}
          radius={ballRadius}
          hover={props.hover}
          setHover={props.setHover}
        />
      ))}
      <use href={'#' + props.hover} onMouseLeave={() => props.setHover('')} />
    </svg>
  );
};

export default SongGraph;
