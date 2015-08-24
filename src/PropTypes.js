import React from 'react';

const DIRECTIONS = ['top', 'right', 'bottom', 'left'];

export const direction = React.PropTypes.oneOf(DIRECTIONS);

export const position = React.PropTypes.oneOf(['start', 'origin', 'end']);

export const region = React.PropTypes.oneOf(['center', ...DIRECTIONS]);
