import React, { Component } from 'react';
import './SongBall.scss';

export default class SongBall extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
        onMouseEnter={() =>
          this.props.center({
            title: this.state.track.track.name,
            artists: this.state.track.track.artists
              .map(e => e.name)
              .join(', '),
            image: (
              <image
                href={this.state.track.track.album.images[0].url}
                width={(Math.SQRT2 * this.state.parentRadius) / 4}
                height={(Math.SQRT2 * this.state.parentRadius) / 4}
                x={(this.state.parentRadius * (2 - Math.SQRT2)) / 8}
                y={(this.state.parentRadius * (2 - Math.SQRT2)) / 8}
                preserveAspectRatio="none"
              />
            ),
          })
        }
        onMouseLeave={this.props.center}
      >
        <circle
          fill={SongBall.getColor(
            this.state.track.camelot / 24,
            1 + this.state.track.audio_features.loudness / 60,
            this.state.track.audio_features.danceability
          )}
          stroke="black"
        >
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
      </g>
    );
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
        image: props.track.track.album.images[0],
      };
    } else {
      return null;
    }
  }

  static getColor(hue, saturation, lightness) {
    let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    let intermediate = chroma * (1 - Math.abs(((hue * 6) % 2) - 1));
    let match = lightness - chroma / 2;
    return (
      '#' +
      ((h, c, x) => {
        if (0 <= h && h <= 1) return [c, x, 0];
        else if (1 < h && h <= 2) return [x, c, 0];
        else if (2 < h && h <= 3) return [0, c, x];
        else if (3 < h && h <= 4) return [0, x, c];
        else if (4 < h && h <= 5) return [x, 0, c];
        else if (5 < h && h <= 6) return [c, 0, x];
        else return [0, 0, 0];
      })(hue * 6, chroma, intermediate)
        .map(e =>
          Math.min(Math.floor(255 * (e + match)), 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
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
