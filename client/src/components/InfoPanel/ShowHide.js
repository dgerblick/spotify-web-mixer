import React, { useState } from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const ShowHide = props => {
  const [visible, setVisible] = useState(() =>
    Object.assign(
      {},
      ...React.Children.map(props.children, e => ({
        [e.props.name]: props.defaults.includes(e.props.name),
      }))
    )
  );
  return (
    <div className="ShowHide">
      {React.Children.map(props.children, e => (
        <div className="element">
          <div className="title">
            <p>{e.props.name}</p>
            <div
              className="iconButton"
              onClick={() =>
                setVisible({
                  ...visible,
                  [e.props.name]: !visible[e.props.name],
                })
              }
            >
              {visible[e.props.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
          </div>
          {!visible[e.props.name] || <div className="content">{e}</div>}
        </div>
      ))}
    </div>
  );
};

ShowHide.defaultProps = {
  defaults: [],
};
export default ShowHide;
