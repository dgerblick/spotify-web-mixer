import React, { Component } from 'react';
import Measure from 'react-measure';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import './PlaylistDisplay.scss';

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radius: 0,
      ballRadius: 0,
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

  componentDidMount() {}

  render() {
    let tracks = [];
    let total = this.props.location.state.data.tracks.total;
    for (let i = 0; i < total; i++) {
      let radius =
        this.state.ballRadius > this.props.minBallSize
          ? this.state.radius
          : this.state.radius *
            Math.sqrt(
              ((0.25) *
                ((i - (i * (total % this.props.turnAngle)) / total) %
                  this.props.turnAngle)) /
                this.props.turnAngle +
                (1 - 0.25)
            );
      let x = radius * Math.cos(2 * Math.PI * (i / total));
      let y = radius * Math.sin(2 * Math.PI * (i / total));
      tracks.push(
        <div
          key={i}
          className="ball"
          style={{
            width: this.state.ballRadius,
            height: this.state.ballRadius,
            top: y + this.state.radius,
            right: x + this.state.radius,
          }}
        />
      );
    }

    return (
      <Measure
        bounds
        onResize={async contentRect => {
          this.setState({ contentRect });
          const result = await this.resize();
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
            <div className="content">{tracks}</div>
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
