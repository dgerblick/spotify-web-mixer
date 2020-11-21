import React from 'react';
import SettingsList from './SettingsList';
import SettingsToggle from './SettingsToggle';
import SettingsValueInRange from './SettingsValueInRange';
import './index.scss';

const ShuffleSettings = props => {
  return (
    <div className="ShuffleSettings">
      <SettingsList
        {...props.settings}
        update={newVal =>
          props.setSettings({ ...props.settings, value: newVal })
        }
      />
    </div>
  );
};

ShuffleSettings.defaultProps = {
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

export default ShuffleSettings;
