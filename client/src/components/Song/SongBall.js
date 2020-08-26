import React, { Component } from 'react';
import './SongBall.scss';
import Color from 'color-thief-react';

export default class SongBall extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.parentRadius !== state.parentRadius ||
      props.radius !== state.radius
    ) {
      return {
        pos: props.pos,
        parentRadius: props.parentRadius,
        radius: props.radius,
        track: props.track,
      };
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.svgAnimate.beginElementAt(this.props.index / this.props.total);
  }

  render() {
    return (
      <g
        className="SongBall"
        id={`ball${this.props.index}`}
        transform={`translate(${this.state.parentRadius + this.state.pos.x}, ${
          this.state.parentRadius + this.state.pos.y
        })`}
      >
        {' '}
        <Color
          src={this.props.track.album.images[0].url}
          crossOrigin="anonymous"
          format="hex"
          quality={this.props.track.album.images[0].width / this.props.samples}
        >
          {({ data, loading, error }) => (
            <circle fill={loading ? 'white' : data}>
              <animate
                ref={svgAnimate => {
                  this.svgAnimate = svgAnimate;
                }}
                attributeName="r"
                dur="200ms"
                begin="indefinite"
                fill="freeze"
                from={0}
                to={this.state.radius}
              />
            </circle>
          )}
        </Color>
      </g>
    );
  }
}

SongBall.defaultProps = {
  resizeDebounce: 100,
  turnAngle: (1 + Math.sqrt(5)) / 2,
  index: 0,
  total: 1,
  radius: 20,
  minRadius: 10,
  parentRadius: 100,
  targetDensity: 5,
  animationLength: 600,
  samples: 10,
};
