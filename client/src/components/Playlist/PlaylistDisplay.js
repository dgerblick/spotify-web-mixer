import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import Measure from 'react-measure';
import './PlaylistDisplay.scss';
import SongBall from '../Song/SongBall';

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radius: 0,
      ballRadius: 0,
      tracks: [],
    };
  }

  resize = AwesomeDebouncePromise(() => {
    let radius = this.state.contentRect.bounds.width / 2;
    let ballRadius =
      (this.state.contentRect.bounds.width * Math.PI) /
      (this.props.location.state.data.tracks.total * 2);

    ballRadius =
      ballRadius > this.props.minBallSize ? ballRadius : this.props.minBallSize;

    this.setState({ radius, ballRadius });
  }, this.props.resizeDebounce);

  getTrackPage(location) {
    if (location != null) {
      axios.get(location).then(res => {
        let tracks = this.state.tracks;
        tracks = [...tracks, ...res.data.items];
        this.setState({ tracks });
        this.getTrackPage(res.data.next);
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
            <div className="content">
              {this.state.tracks.map((value, index) => {
                return (
                  <SongBall
                    key={index}
                    index={index}
                    total={this.props.location.state.data.tracks.total}
                    parentRadius={this.state.radius}
                    radius={this.state.ballRadius}
                    minRadius={10}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Measure>
    );
  }
}

PlaylistDisplay.defaultProps = {
  turnAngle: (1 + Math.sqrt(5)) / 2,
  minBallSize: 10,
  resizeDebounce: 100,
};
