import React from 'react';

export const direction = React.PropTypes.oneOf(
  ['top', 'right', 'bottom', 'left']
);

export const position = React.PropTypes.oneOf(['start', 'origin', 'end']);
