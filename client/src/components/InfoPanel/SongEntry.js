import React, { useState } from 'react';

const SongEntry = props => {
  return (
    <div
      className="SongEntry"
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
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

export default SongEntry;
