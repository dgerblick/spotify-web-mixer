import React from 'react';
import SettingsList from './SettingsList';
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

export default ShuffleSettings;
