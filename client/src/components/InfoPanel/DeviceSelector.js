import React, { useState, useEffect } from 'react';
import Select from 'react-dropdown-select';
import axios from 'axios';

import DevicesIcon from '@material-ui/icons/Devices';

const DeviceSelector = props => {
  const [devices, setDevices] = useState();
  const [options, setOptions] = useState();
  const [current, setCurrent] = useState();

  const updateDeviceList = () => {
    console.log('updateDeviceList');
    axios
      .get('https://api.spotify.com/v1/me/player/devices')
      .then(res => res.data.devices)
      .then(devs => {
        let current = props.noDeviceOption;
        setOptions([...devs, props.refreshOption]);
        setCurrent(current);
        setDevices(devs);
      });
  };
  useEffect(updateDeviceList, []);
  useEffect(() => props.setDevice(current), [current]);

  return (
    <div className="DeviceSelector">
      <DevicesIcon />
      {devices && (
        <Select
          className="selector"
          labelField="name"
          valueField="id"
          values={[current]}
          options={options}
          onChange={([option]) => {
            if (option.id === props.refreshOption.id) updateDeviceList();
            else setCurrent(option);
          }}
        />
      )}
    </div>
  );
};

DeviceSelector.defaultProps = {
  noDeviceOption: { name: 'Select A Device', id: '.select' },
  refreshOption: { name: 'Refresh List', id: '.refresh' },
};

export default DeviceSelector;
