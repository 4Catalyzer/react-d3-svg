import React from 'react';

import Axis from './Axis';
import { positionType } from './PropTypes';
import purePlotClass from './utils/purePlotClass';
import transforms from './utils/transforms';

@purePlotClass
export default class XAxis extends React.Component {
  static propTypes = {
    position: positionType,
    transform: React.PropTypes.string,
    shouldUpdate: React.PropTypes.bool, // For purePlotClass.
  };

  static contextTypes = {
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
  };

  render() {
    const { position, transform, ...props } = this.props;

    let positionTransform;
    if (position == null) {
      positionTransform = null;
    } else {
      const { yScale } = this.context;
      let yTranslate;

      if (position === 'start') {
        yTranslate = yScale.range()[0];
      } else if (position === 'origin') {
        yTranslate = yScale(0);
      } else {
        yTranslate = yScale.range()[1];
      }
      positionTransform = `translate(0,${yTranslate})`;
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
