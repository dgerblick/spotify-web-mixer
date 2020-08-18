import React, { Component } from 'react';
import './SongBall.scss';

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
      let radius = Math.max(props.radius, props.minRadius);
      let fibbFill = Math.min(
        (props.targetDensity * props.total * (radius ** 2)) /
          (props.parentRadius ** 2),
        0.9
      );

      let theta = 2 * Math.PI * (props.index / props.total);

      let r =
        radius > props.minRadius
          ? props.parentRadius - radius * 2
          : (props.parentRadius - radius * 2) *
            Math.sqrt(
              (fibbFill *
                ((props.index -
                  (props.index * (props.total % props.turnAngle)) /
                    props.total) %
                  props.turnAngle)) /
                props.turnAngle +
                (1 - fibbFill)
            );

      return {
        pos: {
          theta,
          r,
          x: r * Math.sin(theta),
          y: -r * Math.cos(theta),
        },
        parentRadius: props.parentRadius,
        radius,
      };
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.svgAnimate.beginElementAt(this.props.index / this.props.total);
  }

  //render() {
  //  return (
  //    <div
  //      className="SongBall"
  //      style={{
  //        width: this.state.radius,
  //        height: this.state.radius,
  //        top: this.state.pos.y + this.state.parentRadius,
  //        right: this.state.pos.x + this.state.parentRadius,
  //        animationDelay: `${
  //          (this.props.index * 1000) / this.props.total +
  //          (Math.random() * 100 - 50)
  //        }ms`,
  //      }}
  //    />
  //  );
  //}
  render() {
    return (
      <g
        className="SongBall"
        transform={`translate(${this.state.parentRadius + this.state.pos.x}, ${
          this.state.parentRadius + this.state.pos.y
        })`}
      >
        {' '}
        <circle>
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
        <animateMotion
          dur={`${this.props.animationLength}s`}
          repeatCount="indefinite"
          path={`M 0 0 A 50 50 0 1 1 ${-2 * this.state.pos.x} ${
            -2 * this.state.pos.y
          } A 50 50 0 1 1 0 0 Z`}
        />
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
  animationLength: 240,
};
