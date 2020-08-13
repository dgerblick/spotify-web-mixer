import React, { Component } from 'react';
import Measure from 'react-measure';
import './PlaylistDisplay.scss';

export default class PlaylistDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radius: 0,
      ballRadius: 0,
    };
  }

  render() {
    let tracks = [];
    let total = this.props.location.state.data.tracks.total;
    for (let i = 0; i < total; i++) {
      tracks.push(
        <div
          className="ball"
          style={{
            width: this.state.ballRadius,
            height: this.state.ballRadius,
            top: this.state.radius * Math.sin(2 * Math.PI * (i / total)) + this.state.radius,
            right: this.state.radius * Math.cos(2 * Math.PI * (i / total)) + this.state.radius,
          }}
        />
      );
    }

    return (
      <Measure
        bounds
        onResize={contentRect => {
          this.setState({
            radius: contentRect.bounds.width / 2,
            ballRadius: (contentRect.bounds.width * Math.PI) / (total * 2),
          });
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
