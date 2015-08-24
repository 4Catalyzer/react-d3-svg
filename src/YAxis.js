import React from 'react';

import Axis from './Axis';
import * as PropTypes from './PropTypes';
import transforms from './utils/transforms';

export default class YAxis extends React.Component {
  static propTypes = {
    position: PropTypes.position,
    transform: React.PropTypes.string
  };

  static contextTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func
  };

  render() {
    const {position, transform, ...props} = this.props;

    let positionTransform;
    if (position == null) {
      positionTransform = null;
    } else {
      const {xScale} = this.context;
      let translateX;

      if (position === 'start') {
        translateX = xScale.range()[0];
      } else if (position === 'origin') {
        translateX = xScale(0);
      } else {
        translateX = xScale.range()[1];
      }
      positionTransform = `translate(${translateX}, 0)`;
    }

    return (
      <Axis
        scale={this.context.yScale}
        transform={transforms(transform, positionTransform)}
        {...props}
      />
    );
  }
}
