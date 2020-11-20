import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongDisplay from './SongDisplay';
import Progress from 'react-progressbar';
import DeviceSelector from './DeviceSelector';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';

const NowPlaying = props => {
  const [playing, setPlaying] = useState();
  const [device, setDevice] = useState();

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/player')
      .then(res => res.data)
      .then(playback => setPlaying(playback));
    const interval = setInterval(() => {
      axios
        .get('https://api.spotify.com/v1/me/player')
        .then(res => res.data)
        .then(playback => setPlaying(playback));
    }, props.updateRate);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (device?.id.indexOf('.') === -1 && playing?.context?.uri === props.uri)
      axios.put('https://api.spotify.com/v1/me/player', {
        device_ids: [device.id],
      });
  }, [device]);

  return (
    <div className="NowPlaying">
      <DeviceSelector setDevice={setDevice} />
      {playing?.context?.uri === props.uri ? (
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
          <div className="controls">
            <ShuffleIcon
              className={playing.shuffle_state ? 'selected' : ''}
              onClick={() =>
                axios.put('https://api.spotify.com/v1/me/player/shuffle', {
                  state: !playing.shuffle_state,
                })
              }
            />
            <SkipPreviousIcon
              onClick={() => {
                console.log(playing.item.duration_ms);
                if (playing.progress_ms < props.msPrev)
                  axios.post('https://api.spotify.com/v1/me/player/previous');
                else
                  axios.put(
                    'https://api.spotify.com/v1/me/player/seek?position_ms=0'
                  );
              }}
            />
            {playing.is_playing ? (
              <PauseIcon
                onClick={() =>
                  axios.put('https://api.spotify.com/v1/me/player/pause')
                }
              />
            ) : (
              <PlayArrowIcon
                onClick={() =>
                  axios.put('https://api.spotify.com/v1/me/player/play')
                }
              />
            )}
            <SkipNextIcon
              onClick={() =>
                axios.post('https://api.spotify.com/v1/me/player/next')
              }
            />
            {playing.repeat_state === 'track' ? (
              <RepeatOneIcon
                className="selected"
                onClick={() =>
                  axios.put(
                    'https://api.spotify.com/v1/me/player/repeat?state=off'
                  )
                }
              />
            ) : (
              <RepeatIcon
                className={playing.repeat_state === 'context' ? 'selected' : ''}
                onClick={() =>
                  axios.put(
                    'https://api.spotify.com/v1/me/player/repeat?state=' +
                      (playing.repeat_state === 'context' ? 'track' : 'context')
                  )
                }
              />
            )}
          </div>
        </SongDisplay>
      ) : (
        <div className="startPlaying">
          <PlayArrowIcon
            onClick={() => {
              if (device?.id.indexOf('.') === -1)
                axios.put(
                  'https://api.spotify.com/v1/me/player/play?device_id=' +
                    device.id,
                  {
                    context_uri: props.uri,
                  }
                );
            }}
          />
          <p>Start Playing</p>
        </div>
      )}
    </div>
  );
};

NowPlaying.defaultProps = {
  updateRate: 1000,
  msPrev: 5000,
};

export default NowPlaying;
