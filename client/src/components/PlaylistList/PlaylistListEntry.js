import React from 'react';
import { AllHtmlEntities } from 'html-entities';
import { Link } from 'react-router-dom';

const PlaylistListEntry = props => {
  let description = props.playlist.description.split(/(<a[^>]*>[^<]*<\/a>)/);
  for (let i = 0; i < description.length; i++) {
    if (/<a[^>]*>[^<]*<\/a>/.test(description[i])) {
      let subparts = description[i].split(/<a[^>]*href="|"[^>]*>|<\/a>/);
      description[i] = AllHtmlEntities.decode(subparts.slice(2).join(''));
    } else {
      description[i] = AllHtmlEntities.decode(description[i]);
    }
  }
  return (
    <Link className="PlaylistListEntry" to={`playlists/${props.playlist.id}`}>
    <div className="playlistCard">
      <img src={props.playlist.images[0]?.url} alt={props.playlist.name} />
      <div className="playlistInfo">
        <h1>{props.playlist.name}</h1>
        <h2>{props.playlist.tracks.total} Tracks</h2>
      </div>
      <p>{description}</p>
    </div>
  </Link>
  );
};

export default PlaylistListEntry;
