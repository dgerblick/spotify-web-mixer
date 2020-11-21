import React, { useState } from 'react';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const SettingsList = props => {
  const [visible, setVisible] = useState(false);
  if (props.settings === null) props.setSettings(props.defaultSettings);
  return (
    <div className="SettingsList">
      <div className="settingsTitle">
        <p>{props.name}</p>
        <div className="settingsDropdown" onClick={() => setVisible(!visible)}>
          {visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </div>
      {!visible || (
        <div className="settingsMenu">
          {Object.keys(props.value).map(key =>
            React.createElement(props.value[key].type, {
              key,
              update: newVal =>
                props.update({
                  ...props.value,
                  [key]: {
                    ...props.value[key],
                    value: newVal,
                  },
                }),
              ...props.value[key],
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsList;
