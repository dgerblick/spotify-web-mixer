import React from 'react';

const GraphCanvas = props => {
  return (
    <svg
      className="GraphCanvas"
      viewBox={
        -props.size +
        ' ' +
        -props.size +
        ' ' +
        2 * props.size +
        ' ' +
        2 * props.size
      }
    ></svg>
  );
};

GraphCanvas.defaultProps = {
  size: 100,
};

export default GraphCanvas;
