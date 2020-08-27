import React, { Component } from 'react';
import ColorThief from 'colorthief';
import './SongBall.scss';

const colorThief = new ColorThief();

export default class SongBall extends Component {
  constructor(props) {
    super(props);

    this.localImageRef = React.createRef();

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
        image: {
          ...props.track.album.images[0],
          jsx: (
            <img
              src={props.track.album.images[0].url}
              alt={props.track.name}
              className="albumCover"
              onLoad={() => console.log('load')}
              style={{
                width: Math.SQRT2 * props.parentRadius / 4,
                height: Math.SQRT2 * props.parentRadius / 4,
              }}
            />
          ),
        },
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
      //<Color
      //  src={this.state.image.url}
      //  crossOrigin="anonymous"
      //  format="hex"
      //  quality={
      //    (this.state.image.width * this.state.image.height) /
      //    this.props.samples
      //  }
      // />
      <g
        className="SongBall"
        id={`ball${this.props.index}`}
        transform={`translate(${this.state.parentRadius + this.state.pos.x}, ${
          this.state.parentRadius + this.state.pos.y
        })`}
        onMouseEnter={() => this.props.center(this.state.image.jsx)}
        onMouseLeave={() => this.props.center(null)}
      >
        <circle fill={'black'}>
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
        <foreignObject>{this.state.image.jsx}</foreignObject>
      </g>
    );
  }
}

SongBall.defaultProps = {
  index: 0,
  total: 1,
  radius: 20,
  parentRadius: 100,
  animationLength: 600,
  samples: 32,
};
