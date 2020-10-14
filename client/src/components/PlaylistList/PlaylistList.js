import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistListEntry from './PlaylistListEntry';
import './index.scss'

const getPlaylists = async playlists => {
  // Base case
  if (playlists.next === null) return playlists.items;
  let res = await axios.get(playlists.next);
  // Recursively get next page
  return [...playlists.items, ...(await getPlaylists(res.data))];
};

const PlaylistList = props => {
  let [playlists, setPlaylists] = useState();

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/playlists')
      .then(res => res.data)
      .then(getPlaylists)
      .then(setPlaylists);
  }, []);
  return (
    <div className="PlaylistList">
      {playlists?.map((playlist, index) => (
        <PlaylistListEntry key={playlist.id} playlist={playlist}/>
      ))}
    </div>
  );
};

export default PlaylistList;
