import React, { useState } from 'react';
import { ShuffleSettings } from './ShuffleSettings';

const SmartShuffler = props => {
  const [settings, setSettings] = useState();

  return (
    <div className="SmartShuffler">
      <ShuffleSettings settings={settings} setSettings={setSettings} />
    </div>
  );
};

export default SmartShuffler;
