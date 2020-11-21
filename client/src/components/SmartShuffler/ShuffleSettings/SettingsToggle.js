import React from 'react';

const SettingsToggle = props => {
  return (
    <div className="SettingsToggle">
      <p className="name">{props.name}</p>
      <div
        className="value"
        onClick={() => props.update(!props.value)}
      >
        {props.value ? <div className="fill" /> : null}
        </div>
    </div>
  );
};

export default SettingsToggle;
