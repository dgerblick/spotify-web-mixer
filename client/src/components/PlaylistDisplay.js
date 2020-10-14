import React, { useState, useEffect } from 'react';
import axios from 'axios';
import async from 'async';
import Scrollbar from 'react-scrollbars-custom';
import { SongGraph } from './SongGraph';
import { InfoPanel, SongEntry } from './InfoPanel';

const mod = (n, m) => ((n % m) + m) % m;

const getTracks = async tracks => {
  // Base case
  if (tracks.next === null) return tracks.items;
  let res = await axios.get(tracks.next);
  // Recursively get next page
  return [...tracks.items, ...(await getTracks(res.data))];
};

const processTracks = async tracks => {
  let trackDict = {};
  // Slice into groups of 100 (max number of tracks/request)
  const groupSize = 100;
  for (let start = 0; start < tracks.length; start += groupSize) {
    let chunk = tracks.slice(start, start + groupSize);
    await axios
      .get(
        'https://api.spotify.com/v1/audio-features?ids=' +
          chunk.map(e => e.track.id).join(',')
      )
      .then(res => {
        async.eachOf(chunk, (track, index) => {
          let features = res.data.audio_features[index];
          let camelot = mod(16 - 10 * features.key + 7 * features.mode, 24);
          // Add to dict
          trackDict[features.id] = {
            ...track,
            features,
            camelot,
          };
        });
      });
  }

  // Bucket sort
  let camelotBuckets = Array.from(Array(24), () => []);
  async.eachOf(trackDict, track =>
    camelotBuckets[track.camelot].push(track.track.id)
  );

  // Add neighbors based on camelot value
  async.eachOf(
    trackDict,
    track =>
      (track.neighbors = [
        ...camelotBuckets[mod(track.camelot + 2, 24)],
        ...camelotBuckets[mod(track.camelot - 2, 24)],
        ...camelotBuckets[mod(2 * Math.floor(track.camelot / 2), 24)],
        ...camelotBuckets[mod(2 * Math.floor(track.camelot / 2) + 1, 24)],
      ])
  );

  let keys = Object.keys(trackDict);
  return {
    ids: {
      count: keys.length,
      byDefault: keys,
      byCamelot: camelotBuckets.flat(),
    },
    tracks: trackDict,
  };
};

const PlaylistDisplay = props => {
  const [tracks, setTracks] = useState();
  const [hover, setHover] = useState('');

  // Run on inital render
  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1' + props.location.pathname)
      .then(res => res.data.tracks)
      .then(getTracks)
      .then(processTracks)
      .then(setTracks);
  }, []);

  return (
    <div className="PlaylistDisplay">
      {tracks && <SongGraph tracks={tracks} hover={hover} setHover={setHover} />}
      <InfoPanel style={{ right: 0 }}>
        <Scrollbar style={{ maxHeight: '100%' }}>
          {tracks?.ids.byDefault.map(key => (
            <SongEntry
              key={key}
              track={tracks.tracks[key]}
              onMouseEnter={() => setHover(key)}
              onMouseLeave={() => setHover('')}
            />
          ))}
        </Scrollbar>
      </InfoPanel>
    </div>
  );
};

export default PlaylistDisplay;
