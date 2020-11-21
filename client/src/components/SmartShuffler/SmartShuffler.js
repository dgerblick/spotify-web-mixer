import React, { useState, useEffect } from 'react';
import {
  ShuffleSettings,
  SettingsList,
  SettingsToggle,
  SettingsValueInRange,
} from './ShuffleSettings';
import './index.scss';

const SmartShuffler = props => {
  const [settings, setSettings] = useState(props.settings);
  const [progress, setProgress] = useState(-1);

  const enable = settings.value.enable.value;
  const setEnable = newEnable =>
    setSettings({
      ...settings,
      value: {
        ...settings.value,
        enable: {
          ...settings.value.enable,
          value: newEnable,
        },
      },
    })

  useEffect(() => {
    if (enable) {
      new Promise(() => {
        setProgress(0);
        setEnable(false);
      }).then(() => { });
    }
  }, [enable]);

  return (
    <div className="SmartShuffler">
      <ShuffleSettings settings={settings} setSettings={setSettings} />
      <p>{progress}</p>
      <p
        className="startStopButton"
        onClick={() => {
          if (!enable)
            setEnable(true);
        }}
      >
        {progress === -1 ? 'Run' : 'Running'}
      </p>
    </div>
  );
};

SmartShuffler.defaultProps = {
  settings: {
    name: 'Settings',
    value: {
      enable: {
        name: 'Enable',
        value: false,
        type: SettingsToggle,
      },
      minQueueSize: {
        name: 'Minimum Queue Size',
        value: 10,
        type: SettingsValueInRange,
        min: 0,
        max: 50,
      },
    },
    type: SettingsList,
  },
};

export default SmartShuffler;
