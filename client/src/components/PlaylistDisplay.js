import React from 'react';
import { SongGraph } from './SongGraph'

const PlaylistDisplay = props => {
  return <div className="PlaylistDisplay">
    <SongGraph pathname={props.location.pathname} />
  </div>
}

export default PlaylistDisplay;