import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import Measure from 'react-measure';
import async from 'async';
import './PlaylistDisplay.scss';
import SongBall from '../Song/SongBall';

const mod = (n, m) => ((n % m) + m) % m;
const getColor = (hue, saturation, lightness) => {
  let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  let intermediate = chroma * (1 - Math.abs(((hue * 6) % 2) - 1));
  let match = lightness - chroma / 2;
  return (
    '#' +
    ((h, c, x) => {
      if (0 <= h && h <= 1) return [c, x, 0];
      else if (1 < h && h <= 2) return [x, c, 0];
      else if (2 < h && h <= 3) return [0, c, x];
      else if (3 < h && h <= 4) return [0, x, c];
      else if (4 < h && h <= 5) return [x, 0, c];
      else if (5 < h && h <= 6) return [c, 0, x];
      else return [0, 0, 0];
    })(hue * 6, chroma, intermediate)
      .map(e =>
        Math.min(Math.floor(255 * (e + match)), 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
};

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.updateCenter = this.updateCenter.bind(this);

    this.state = {
      total: this.props.location.state.data.tracks.total,
      radius: 0,
      ballRadius: 0,
      tracks: {},
      trackKeys: [],
      trackConnections: [],
      ready: 0,
      center: {},
    };
  }

  resize = AwesomeDebouncePromise(contentRect => {
    let radius =
      contentRect === undefined
        ? this.state.radius
        : contentRect.bounds.width / 2;
    let ballRadius = Math.max(
      (2 * radius * Math.PI) / (this.state.total * 4),
      this.props.minBallRadius
    );
    let tracks = this.state.tracks;
    async.eachOf(this.state.trackKeys, (key, index) => {
      let fibbFill = Math.min(
        this.props.targetBallDensity * this.state.total,
        0.9
      );

      let theta = 2 * Math.PI * (index / this.state.total);

      let r =
        ballRadius > this.props.minBallRadius
          ? radius - ballRadius * 2
          : (radius - ballRadius * 2) *
            Math.sqrt(
              (fibbFill *
                ((index -
                  (index * (this.state.total % this.props.turnAngle)) /
                    this.state.total) %
                  this.props.turnAngle)) /
                this.props.turnAngle +
                (1 - fibbFill)
            );
      tracks[key].pos = {
        x: r * Math.sin(theta),
        y: -r * Math.cos(theta),
      };
      tracks[key].radius = ballRadius;
    });
    this.setState({
      radius,
      ballRadius,
      tracks,
      ready: 1,
    });
  }, this.props.resizeDebounce);

  getTrackPage(location) {
    if (location != null) {
      axios.get(location).then(res => {
        let trackArray = res.data.items;
        let next = res.data.next;
        axios
          .get(
            'https://api.spotify.com/v1/audio-features?ids=' +
              trackArray.map(e => e.track.id).join(',')
          )
          .then(res => {
            async.eachOf(trackArray, (track, index) => {
              let features = res.data.audio_features[index];
              let camelot = mod(16 - 10 * features.key + 7 * features.mode, 24);
              trackArray[index] = {
                ...track,
                audio_features: features,
                camelot: camelot,
                pos: {
                  x: 0,
                  y: 0,
                },
                color: getColor(camelot / 24, 1, features.danceability),
              };
            });

            let tracks = trackArray.reduce(
              (accum, track) => ({ ...accum, [track.track.id]: track }),
              {}
            );
            this.setState({
              tracks: { ...this.state.tracks, ...tracks },
              ready:
                (Object.keys(this.state.tracks).length + trackArray.length) /
                (this.state.total + 1),
            });
            this.getTrackPage(next);
          });
      });
    } else {
      let tracks = this.state.tracks;
      let trackKeys = Object.keys(tracks);

      let camelotBins = Array.from(Array(24), () => []);
      trackKeys.forEach(key => camelotBins[tracks[key].camelot].push(key));

      let connections = [];
      trackKeys = [];
      camelotBins.forEach((camelot, index) => {
        trackKeys.push(...camelot);
        connections.push([
          ...camelotBins[mod(index + 2, 24)],
          ...camelotBins[mod(index - 2, 24)],
          ...camelotBins[mod(2 * Math.floor(index / 2), 24)],
          ...camelotBins[mod(2 * Math.floor(index / 2) + 1, 24)],
        ]);
      });

      async.each(tracks, track => {
        track.neighbors = connections[track.camelot].filter(
          key => key !== track.track.id
        );
      });

      this.setState({
        tracks,
        trackKeys,
        ready: 0.99,
      });
      this.resize();
    }
  }

  updateCenter(newCenter) {
    this.setState({ center: { ...newCenter } });
  }

  componentDidMount() {
    if (Object.keys(this.state.tracks).length === 0) {
      this.getTrackPage(this.props.location.state.data.tracks.href);
    }
  }

  render() {
    return (
      <Measure
        bounds
        onResize={async contentRect => await this.resize(contentRect)}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="PlaylistDisplay">
            <svg
              className="canvas"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`${-this.state.radius} ${-this.state.radius} ${
                2 * this.state.radius
              } ${2 * this.state.radius}`}
            >
              {this.state.ready !== 1 && (
                <circle
                  id="loadingProgress"
                  r={this.state.radius / 2}
                  cx={0}
                  cy={0}
                  strokeDasharray={Math.PI * this.state.radius}
                  strokeDashoffset={
                    Math.PI * this.state.radius * (1 - this.state.ready)
                  }
                />
              )}
              <g className="nodes">
                {this.state.trackKeys.map(key => (
                  <SongBall
                    pos={this.state.tracks[key].pos}
                    key={this.state.tracks[key].track.id}
                    radius={this.state.tracks[key].radius}
                    center={this.updateCenter}
                    track={this.state.tracks[key]}
                    className={this.state.ready === 1 ? 'ready' : 'notReady'}
                  />
                ))}
              </g>
              {this.state.center.id ? (
                <g>
                  <image
                    href={this.state.center.image}
                    width={this.state.radius / 2}
                    height={this.state.radius / 2}
                    x={-this.state.radius / 4}
                    y={-this.state.radius / 4}
                    preserveAspectRatio="none"
                  />
                  <text
                    fontSize={this.props.centerFontSize}
                    textAnchor="middle"
                    x={0}
                    y={-this.state.radius / 4 - this.props.centerFontSize / 2}
                    width={this.state.radius * 2}
                    id="test12"
                  >
                    {this.state.center.title}
                  </text>
                  <text
                    fontSize={this.props.centerFontSize}
                    textAnchor="middle"
                    x={0}
                    y={this.state.radius / 4 + this.props.centerFontSize}
                    width={this.state.radius * 2}
                  >
                    {this.state.center.artists}
                  </text>
                  <g
                    className="selected"
                    transform={`translate(${this.state.center.pos.x}, ${this.state.center.pos.y})`}
                  >
                    <g className="connections">
                      {this.state.center.neighbors.map(key => {
                        let neighbor = this.state.tracks[key];
                        let x = neighbor.pos.x - this.state.center.pos.x;
                        let y = neighbor.pos.y - this.state.center.pos.y;
                        let xArc = x / 2 - y / 4;
                        let yArc = y / 2 - x / 4;
                        return (
                          <path
                            key={key}
                            d={`M 0 0 Q ${xArc} ${yArc} ${x} ${y}`}
                            stroke={neighbor.color}
                            strokeWidth={this.props.lineWidth}
                            fill="none"
                          />
                        );
                      })}
                    </g>
                    <use
                      href={`#${this.state.center.id}`}
                      onMouseLeave={() => this.updateCenter({})}
                    />
                  </g>
                </g>
              ) : (
                <g>
                  <defs>
                    <pattern
                      id="center"
                      x="0%"
                      y="0%"
                      height="100%"
                      width="100%"
                      viewBox={`0 0 ${this.state.radius / 2} ${
                        this.state.radius / 2
                      }`}
                    >
                      <image
                        href={this.props.location.state.image.url}
                        width={this.state.radius / 2}
                        height={this.state.radius / 2}
                        x="0"
                        y="0"
                        preserveAspectRatio="none"
                      />
                    </pattern>
                  </defs>
                  <circle
                    cx={0}
                    cy={0}
                    r={this.state.radius / 4}
                    fill="url(#center)"
                  />
                </g>
              )}
            </svg>
          </div>
        )}
      </Measure>
    );
  }
}

PlaylistDisplay.defaultProps = {
  resizeDebounce: 100,
  minBallRadius: 10,
  targetBallDensity: 1 / 1000,
  turnAngle: (1 + Math.sqrt(5)) / 2,
  lineWidth: 2,
  centerFontSize: 24,
};
