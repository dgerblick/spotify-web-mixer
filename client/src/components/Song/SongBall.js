import React, { Component } from 'react';
import './SongBall.scss';

export default class SongBall extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <g
        className="SongBall"
        transform={`translate(${this.state.pos.x}, ${this.state.pos.y})`}
        onMouseEnter={() =>
          this.props.center({
            id: this.state.track.track.id,
            pos: this.state.pos,
            title: this.state.track.track.name,
            artists: this.state.track.track.artists.map(e => e.name).join(', '),
            image: this.state.track.track.album.images[0].url,
            neighbors: this.state.track.neighbors,
          })
        }
      >
        <circle
          id={this.state.track.track.id}
          fill={this.state.track.color}
          stroke="black"
          r={this.state.radius}
        />
      </g>
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (props.radius !== state.radius) {
      return {
        pos: props.pos,
        radius: props.radius,
        track: props.track,
        image: props.track.track.album.images[0],
      };
    } else {
      return null;
    }
  }
}

SongBall.defaultProps = {
  index: 0,
  total: 1,
  radius: 20,
  animationLength: 600,
  samples: 32,
};
