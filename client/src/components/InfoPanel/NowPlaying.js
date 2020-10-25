import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongDisplay from './SongDisplay';
import Progress from 'react-progressbar';

const NowPlaying = props => {
  const [playing, setPlaying] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://api.spotify.com/v1/me/player/currently-playing')
        .then(res => res.data)
        .then(playback => setPlaying(playback));
    }, props.updateRate);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="NowPlaying">
      {playing && (
        <SongDisplay
          large
          track={{ track: playing.item }}
          setHover={props.setHover}
        >
          <div className="progressBar">
            <Progress
              className="bar"
              height={4}
              color="#F8F8F8"
              animation={2 * props.updateRate}
              completed={(100 * playing.progress_ms) / playing.item.duration_ms}
            />
            <p className="progress">
              {Math.floor(playing.progress_ms / 60000)}:
              {(Math.floor(playing.progress_ms / 1000) % 60)
                .toString()
                .padStart(2, '0')}
            </p>
            <p className="duration">
              {Math.floor(playing.item.duration_ms / 60000)}:
              {(Math.floor(playing.item.duration_ms / 1000) % 60)
                .toString()
                .padStart(2, '0')}
            </p>
          </div>
        </SongDisplay>
      )}
    </div>
  );
};

NowPlaying.defaultProps = {
  updateRate: 500,
};

export default NowPlaying;
