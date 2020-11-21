import React from 'react';
import ReactSlider from 'react-slider';

const SettingsValueInRange = props => {

  return (
    <div className="SettingsValueInRange">
      <p className="name">{props.name}</p>
      <ReactSlider
        className="slider"
        thumbClassName="thumb"
        trackClassName="track"
        max={props.max}
        min={props.min}
        defaultValue={props.value}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        onChange={props.update}
      />
    </div>
  );
};

export default SettingsValueInRange;
