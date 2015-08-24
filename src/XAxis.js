import React from 'react';

import Axis from './Axis';
import * as PropTypes from './PropTypes';
import transforms from './utils/transforms';

export default class XAxis extends React.Component {
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
      const {yScale} = this.context;
      let translateY;

      if (position === 'start') {
        translateY = yScale.range()[0];
      } else if (position === 'origin') {
        translateY = yScale(0);
      } else {
        translateY = yScale.range()[1];
      }
      positionTransform = `translate(0,${translateY})`;
    }

    return (
      <Axis
        scale={this.context.xScale}
        transform={transforms(transform, positionTransform)}
        {...props}
      />
    );
  }
}
