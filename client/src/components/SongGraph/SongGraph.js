import React, { useState } from 'react';
import async from 'async';
import SongVertex from './SongVertex';
import SongEdge from './SongEdge';
import './index.scss';

const getColor = (hue, saturation, lightness) => {
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
};

const SongGraph = props => {
  let ballRadius = Math.max(0.02, (0.5 * Math.PI) / props.tracks?.ids.count);
  let [data] = useState(() => {
    let data = {};
    async.eachOf(props.tracks.ids.byCamelot, (key, index) => {
      let fill = Math.min(
        props.tracks.ids.count / props.targetBallDensity,
        0.9
      );
      let theta = (2 * Math.PI * index) / props.tracks.ids.count;
      let r =
        (1 - 2 * ballRadius) *
        Math.sqrt(
          (fill *
            ((index -
              (index * (props.tracks.ids.count % props.turnAngle)) /
                props.tracks.ids.count) %
              props.turnAngle)) /
            props.turnAngle +
            (1 - fill)
        );
      data[key] = {
        color: getColor(
          props.tracks.tracks[key].camelot / 24,
          1,
          props.tracks.tracks[key].features.danceability
        ),
        pos: {
          x: r * Math.cos(theta),
          y: r * Math.sin(theta),
        },
      };
    });
    return data;
  });

  return (
    <svg
      className="SongGraph"
      viewBox="-1 -1 2 2"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.tracks.ids.byCamelot.map(key => (
        <SongVertex
          key={key}
          track={props.tracks.tracks[key]}
          data={data[key]}
          radius={ballRadius}
          hover={props.hover}
          setHover={props.setHover}
        />
      ))}
      {props.hover !== '' && (
        <g>
          {props.tracks.tracks[props.hover].neighbors.map(neighbor => (
            <SongEdge
              key={'edge-' + neighbor}
              from={data[props.hover]}
              to={data[neighbor]}
            />
          ))}
          <use
            href={'#' + props.hover}
            onMouseLeave={() => props.setHover('')}
          />
        </g>
      )}
    </svg>
  );
};

SongGraph.defaultProps = {
  targetBallDensity: 1000,
  turnAngle: (1 + Math.sqrt(5)) / 2,
  lineWidth: 2,
};

export default SongGraph;
