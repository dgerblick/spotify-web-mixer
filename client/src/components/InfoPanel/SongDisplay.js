import React, { useState, useEffect, useRef } from 'react';

const SongDisplay = props => {
  const myRef = useRef(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (props.hover && !props.mouseOver)
      props.scrollBar.centerAt(
        0,
        myRef.current.offsetTop + myRef.current.offsetHeight / 2
      );
  }, [props.hover]);

  return (
    <div
      className={
        'SongDisplay' + (props.hover || props.large ? ' large' : ' small')
      }
      onMouseEnter={() => {
        setTimer(setTimeout(() => props.setHover(props.track?.track.id), 100));
      }}
      onMouseLeave={() => {
        clearTimeout(timer);
        setTimer(null);
        props.setHover('');
      }}
      ref={myRef}
    >
      <img
        className="albumCover"
        src={props.track?.track.album.images[0]?.url}
        alt={props.track?.track.name}
      />
      <div className="songInfo">
        <p className="songTitle">{props.track.track.name}</p>
        <p className="artists">
          {props.track?.track.artists.map(e => e.name).join(', ')}
        </p>
        {props.hover && (
          <div className="hidden">
            <p className="albumName">{props.track.track.album.name}</p>
            <p className="duration">
              Duration: {Math.floor(props.track.track.duration_ms / 60000)}:
              {(Math.floor(props.track.track.duration_ms / 1000) % 60)
                .toString()
                .padStart(2, '0')}
            </p>
            <p className="neighborCount">
              Neighbors: {props.track.neighbors.length}
            </p>
          </div>
        )}
      </div>
      {props.children}
    </div>
  );
};

SongDisplay.defaultProps = {
  hover: false,
  setHover: () => {},
  mouseOver: false,
  large: false,
};

export default SongDisplay;
