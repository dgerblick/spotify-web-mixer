import React, { useState } from 'react';
import SongListEntry from './SongDisplay';

const SongList = props => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      className="SongList"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {props.tracks.ids.byDefault.map(key => (
        <SongListEntry
          key={key}
          track={props.tracks.tracks[key]}
          hover={props.hover === key}
          scrollBar={props.scrollRef.current}
          setHover={props.setHover}
          mouseOver={mouseOver}
        />
      ))}
    </div>
  );
};

export default SongList;
