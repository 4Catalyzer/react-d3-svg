import React from 'react';

import Axis from './Axis';
import {positionType} from './PropTypes';
import purePlotClass from './utils/purePlotClass';
import transforms from './utils/transforms';

@purePlotClass
export default class YAxis extends React.Component {
  static propTypes = {
    position: positionType,
    transform: React.PropTypes.string,
    shouldUpdate: React.PropTypes.bool  // For purePlotClass.
  };

  static contextTypes = {
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
      let xTranslate;

      if (position === 'start') {
        xTranslate = xScale.range()[0];
      } else if (position === 'origin') {
        xTranslate = xScale(0);
      } else {
        xTranslate = xScale.range()[1];
      }
      positionTransform = `translate(${xTranslate}, 0)`;
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
