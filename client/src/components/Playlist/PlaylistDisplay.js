import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import Measure from 'react-measure';
import async from 'async';
import './PlaylistDisplay.scss';
import SongBall from '../Song/SongBall';

const mod = (n, m) => ((n % m) + m) % m;

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.updateCenter = this.updateCenter.bind(this);

    this.state = {
      total: this.props.location.state.data.tracks.total,
      radius: 0,
      ballRadius: 0,
      tracks: [],
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
    async.eachOf(tracks, (value, index) => {
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
      value.pos = {
        x: r * Math.sin(theta),
        y: -r * Math.cos(theta),
      };
      value.radius = ballRadius;
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
        let tracks = res.data.items;
        let next = res.data.next;
        axios
          .get(
            'https://api.spotify.com/v1/audio-features?ids=' +
              tracks.map(e => e.track.id).join(',')
          )
          .then(res => {
            async.eachOf(tracks, (e, i) => {
              e.audio_features = res.data.audio_features[i];
              e.camelot = mod(
                16 -
                  10 * res.data.audio_features[i].key +
                  7 * res.data.audio_features[i].mode,
                24
              );
              e.pos = {
                x: 0,
                y: 0,
              };
            });
            this.setState({
              tracks: [...this.state.tracks, ...tracks],
              ready:
                (this.state.tracks.length + tracks.length) /
                (this.state.total + 1),
            });
            this.getTrackPage(next);
          });
      });
    } else {
      let tracks = this.state.tracks;
      tracks.sort((a, b) => a.camelot - b.camelot);
      this.setState({
        tracks,
        ready: 0.99,
      });
      this.resize();
    }
  }

  updateCenter(newCenter) {
    this.setState({ center: { ...newCenter } });
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
        onResize={async contentRect => await this.resize(contentRect)}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="PlaylistDisplay">
            <svg className="canvas" xmlns="http://www.w3.org/2000/svg">
              {this.state.ready !== 1 && (
                <circle
                  id="loadingProgress"
                  r={this.state.radius / 2}
                  cx={this.state.radius}
                  cy={this.state.radius}
                  strokeDasharray={Math.PI * this.state.radius}
                  strokeDashoffset={
                    Math.PI * this.state.radius * (1 - this.state.ready)
                  }
                />
              )}
              <g className="nodes">
                {this.state.tracks.map((value, index) => (
                  <SongBall
                    pos={value.pos}
                    key={value.track.id}
                    parentRadius={this.state.radius}
                    radius={value.radius}
                    center={this.updateCenter}
                    track={value}
                    className={this.state.ready === 1 ? 'ready' : 'notReady'}
                  />
                  //{false &&
                  //  this.state.tracks.slice(index).map((subValue, subIndex) => {
                  //    if (
                  //      value.camelot === subValue.camelot ||
                  //      mod(value.camelot + 2, 24) === subValue.camelot ||
                  //      mod(value.camelot - 2, 24) === subValue.camelot ||
                  //      Math.floor(value.camelot / 2) ===
                  //        Math.floor(subValue.camelot / 2)
                  //    )
                  //      return (
                  //        <line
                  //          key={`line${index}-${subIndex}`}
                  //          x1={value.pos.x + this.state.radius}
                  //          y1={value.pos.y + this.state.radius}
                  //          x2={subValue.pos.x + this.state.radius}
                  //          y2={subValue.pos.y + this.state.radius}
                  //          style={{
                  //            stroke: 'black',
                  //            strokeWidth: this.props.lineWidth * value.radius,
                  //          }}
                  //        />
                  //      );
                  //    else return null;
                  //  })}
                ))}
              </g>
              {this.state.center.id ? (
                <g>
                  {this.state.center.image}
                  <text
                    fontSize={this.props.centerFontSize}
                    textAnchor="middle"
                    x={this.state.radius}
                    y={0.75 * this.state.radius - this.props.centerFontSize / 2}
                    width={this.state.radius * 2}
                    id="test12"
                  >
                    {this.state.center.title}
                  </text>
                  <text
                    fontSize={this.props.centerFontSize}
                    textAnchor="middle"
                    x={this.state.radius}
                    y={1.25 * this.state.radius + this.props.centerFontSize}
                    width={this.state.radius * 2}
                  >
                    {this.state.center.artists}
                  </text>
                  <g
                    className="selected"
                    transform={this.state.center.transform}
                  >
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
                    cx={this.state.radius}
                    cy={this.state.radius}
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
  lineWidth: 0.05,
  centerFontSize: 24,
};
