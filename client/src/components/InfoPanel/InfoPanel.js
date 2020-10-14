import React from 'react';
import './index.scss';

const InfoPanel = props => {
  return (
    <div className="InfoPanel" style={props.style}>
      {props.children}
    </div>
  );
};

export default InfoPanel;
