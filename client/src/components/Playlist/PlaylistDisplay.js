import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import Measure from 'react-measure';
import './PlaylistDisplay.scss';
import SongBall from '../Song/SongBall';

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
              e.camelot =
                res.data.audio_features[i].mode +
                2 *
                  ((((8 - 5 * res.data.audio_features[i].key) % 12) + 12) % 12);
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
                  <SongBall
                    key={index}
                    index={index}
                    total={this.props.location.state.data.tracks.total}
                    parentRadius={this.state.radius}
                    radius={this.state.ballRadius}
                    minRadius={5}
                    ref={this.timingRef}
                  />
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
};
