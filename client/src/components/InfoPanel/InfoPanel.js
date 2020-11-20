import React, { useRef } from 'react';
import './index.scss';
import Scrollbar from 'react-scrollbars-custom';

const InfoPanel = props => {
  const scrollRef = useRef(null);

  return (
    <div className="InfoPanel" style={props.right ? { right: 0 } : {}}>
      <Scrollbar
        noScrollX
        ref={scrollRef}
        scrollbarWidth={props.scrollbarWidth}
      >
        {React.cloneElement(props.children, { scrollRef })}
      </Scrollbar>
    </div>
  );
};

InfoPanel.defaultProps = {
  right: false,
  scrollbarWidth: 20,
};

export default InfoPanel;
