import React, { useEffect, useRef } from 'react';

const SongListEntry = props => {
  const myRef = useRef(null);
  useEffect(() => {
    if (props.hover && !props.mouseOver)
      props.scrollBar.centerAt(
        0,
        myRef.current.offsetTop + myRef.current.offsetHeight / 2
      );
  }, [props.hover]);

  return (
    <div
      className={'SongListEntry' + (props.hover ? ' hover' : '')}
      onMouseEnter={() => props.setHover(props.track.track.id)}
      onMouseLeave={() => props.setHover('')}
      ref={myRef}
    >
      <img
        className="albumCover"
        src={props.track.track.album.images[0]?.url}
        alt={props.track.track.name}
      />
      <div className="songInfo">
        <p className="songTitle">{props.track.track.name}</p>
        <p className="artists">
          {props.track.track.artists.map(e => e.name).join(', ')}
        </p>
      </div>
    </div>
  );
};

export default SongListEntry;
