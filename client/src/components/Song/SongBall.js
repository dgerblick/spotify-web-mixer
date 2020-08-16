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
      let fibbFill =
        (props.targetDensity * props.total) /
        (Math.PI * props.parentRadius ** 2);
      fibbFill = fibbFill > 0.9 ? 0.9 : fibbFill
      
      let theta = 2 * Math.PI * (props.index / props.total);

      let r =
        props.radius > props.minRadius
          ? props.parentRadius
          : props.parentRadius *
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
          x: r * Math.cos(theta),
          y: -r * Math.sin(theta),
        },
        parentRadius: props.parentRadius,
      };
    } else {
      return null;
    }
  }

  render() {
    return (
      <div
        className="SongBall"
        style={{
          width: this.props.radius,
          height: this.props.radius,
          top: this.state.pos.y + this.state.parentRadius,
          right: this.state.pos.x + this.state.parentRadius,
        }}
      />
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
  targetDensity: 500,
};
