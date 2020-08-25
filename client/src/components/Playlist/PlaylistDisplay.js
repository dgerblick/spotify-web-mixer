import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import Measure from 'react-measure';
import './PlaylistDisplay.scss';
import SongBall from '../Song/SongBall';

const mod = (n, m) => ((n % m) + m) % m;

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.timingRef = React.createRef();

    this.state = {
      radius: 0,
      ballRadius: 0,
      tracks: [],
      ready: false,
    };
  }

  resize = AwesomeDebouncePromise(() => {
    let radius = this.state.contentRect.bounds.width / 2;
    let ballRadius =
      (this.state.contentRect.bounds.width * Math.PI) /
      (this.props.location.state.data.tracks.total * 4);

    this.setState({ radius, ballRadius });
  }, this.props.resizeDebounce);

  getTrackPage(location) {
    if (location != null) {
      axios.get(location).then(res => {
        let tracks = res.data.items;
        let next = res.data.next;
        axios
          .get(
            'https://api.spotify.com/v1/audio-features?ids=' +
              tracks.map(e => e.track.id).join(',')
          )
          .then(res => {
            tracks.forEach((e, i) => {
              e.audio_features = res.data.audio_features[i];
              e.camelot = mod(
                16 -
                  10 * res.data.audio_features[i].key +
                  7 * res.data.audio_features[i].mode,
                24
              );
            });
            this.setState({
              tracks: [...this.state.tracks, ...tracks],
            });
            this.getTrackPage(next);
          });
      });
    } else {
      let tracks = this.state.tracks;
      tracks.sort((a, b) => a.camelot - b.camelot);
      tracks.forEach((value, index) => {
        let total = this.props.location.state.data.tracks.total;
        let radius = Math.max(this.state.ballRadius, this.props.minBallRadius);
        let fibbFill = Math.min(
          (this.props.targetBallDensity * total * radius ** 2) /
            this.state.radius ** 2,
          0.9
        );

        let theta = 2 * Math.PI * (index / total);

        let r =
          radius > this.props.minBallRadius
            ? this.state.radius - radius * 2
            : (this.state.radius - radius * 2) *
              Math.sqrt(
                (fibbFill *
                  ((index - (index * (total % this.props.turnAngle)) / total) %
                    this.props.turnAngle)) /
                  this.props.turnAngle +
                  (1 - fibbFill)
              );
        value.pos = {
          x: r * Math.sin(theta),
          y: -r * Math.cos(theta),
        };
        value.radius = radius;
      });
      this.setState({
        tracks,
        ready: true,
      });
    }
  }

  componentDidMount() {
    if (this.state.tracks.length === 0) {
      this.getTrackPage(this.props.location.state.data.tracks.href);
    }
  }

  render() {
    return (
      <Measure
        bounds
        onResize={async contentRect => {
          this.setState({ contentRect });
          await this.resize();
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="PlaylistDisplay">
            <img
              src={this.props.location.state.image.url}
              alt={this.props.location.state.data.name}
              className="playlistCover"
              style={{
                width: this.state.radius / 2,
                height: this.state.radius / 2,
              }}
            />
            <svg className="canvas">
              {this.state.ready &&
                this.state.tracks.map((value, index) => (
                  <g key={`group${index}`}>
                    <SongBall
                      pos={value.pos}
                      key={`ball${index}`}
                      parentRadius={this.state.radius}
                      radius={value.radius}
                      ref={this.timingRef}
                      track={value.track}
                    />
                    {this.state.tracks
                      .slice(index)
                      .map((subValue, subIndex) => {
                        if (
                          value.camelot === subValue.camelot ||
                          mod(value.camelot + 1, 24) === subValue.camelot ||
                          mod(value.camelot - 1, 24) === subValue.camelot ||
                          Math.floor(value.camelot / 2) ===
                            Math.floor(subValue.camelot / 2)
                        )
                          return (
                            <line
                              key={`line${index}-${subIndex}`}
                              x1={value.pos.x + this.state.radius}
                              y1={value.pos.y + this.state.radius}
                              x2={subValue.pos.x + this.state.radius}
                              y2={subValue.pos.y + this.state.radius}
                              style={{
                                stroke: 'black',
                                strokeWidth: 0.1,
                              }}
                            />
                          );
                      })}
                  </g>
                ))}
            </svg>
          </div>
        )}
      </Measure>
    );
  }
}

PlaylistDisplay.defaultProps = {
  resizeDebounce: 100,
  minBallRadius: 5,
  targetBallDensity: 5,
  turnAngle: (1 + Math.sqrt(5)) / 2,
};
