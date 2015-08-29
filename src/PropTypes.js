import React from 'react';

const DIRECTIONS = ['top', 'right', 'bottom', 'left'];

export const directionType = React.PropTypes.oneOf(DIRECTIONS);

export const positionType = React.PropTypes.oneOf(['start', 'origin', 'end']);

export const regionType = React.PropTypes.oneOf(['center', ...DIRECTIONS]);
