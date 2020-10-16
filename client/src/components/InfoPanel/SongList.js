import React, { useState, useRef } from 'react';
import Scrollbar from 'react-scrollbars-custom';
import SongListEntry from './SongListEntry';

const SongList = props => {
  const scrollRef = useRef(null);
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <Scrollbar
      className="SongList"
      ref={scrollRef}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {props.tracks.ids.byDefault.map(key => (
        <SongListEntry
          key={key}
          track={props.tracks.tracks[key]}
          hover={props.hover === key}
          scrollBar={scrollRef.current}
          setHover={props.setHover}
          mouseOver={mouseOver}
        />
      ))}
    </Scrollbar>
  );
};

export default SongList;
