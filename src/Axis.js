import React from 'react';

import * as PropTypes from './PropTypes';

export default class Axis extends React.Component {
  static propTypes = {
    scale: React.PropTypes.func.isRequired,
    orient: PropTypes.direction.isRequired,
    innerTickSize: React.PropTypes.number.isRequired,
    outerTickSize: React.PropTypes.number.isRequired,
    tickPadding: React.PropTypes.number.isRequired,
    ticks: React.PropTypes.any.isRequired,
    tickValues: React.PropTypes.array,
    tickFormat: React.PropTypes.func,
    children: React.PropTypes.node
  };

  static defaultProps = {
    innerTickSize: 6,
    outerTickSize: 6,
    tickPadding: 3,
    ticks: [10]
  };

  render() {
    const {
      scale,
      orient,
      innerTickSize,
      outerTickSize,
      tickPadding,
      ticks: tickArgumentsRaw,
      tickValues,
      tickFormat: tickFormatIn,
      children,
      ...props
    } = this.props;

    let tickArguments;
    if (Array.isArray(tickArgumentsRaw)) {
      tickArguments = tickArgumentsRaw;
    } else {
      tickArguments = [tickArgumentsRaw];
    }

    let ticks;
    if (tickValues) {
      ticks = tickValues;
    } else if (scale.ticks) {
      ticks = scale.ticks(...tickArguments);
    } else {
      ticks = scale.domain();
    }

    let tickFormat;
    if (tickFormatIn) {
      tickFormat = tickFormatIn;
    } else if (scale.tickFormat) {
      tickFormat = scale.tickFormat(...tickArguments);
    }

    const [rangeStart, rangeEnd] = scale.range();
    const tickSpacing = Math.max(innerTickSize, 0) + tickPadding;
    const sign = orient === 'top' || orient === 'left' ? -1 : 1;

    const innerTickMove = sign * innerTickSize;
    const outerTickMove = sign * outerTickSize;
    const tickSpacingMove = sign * tickSpacing;

    let tickTransform;
    let lineProps;
    let textProps;
    let pathD;

    if (orient === 'top' || orient === 'bottom') {
      tickTransform = d => `translate(${scale(d)},0)`;
      lineProps = {x2: 0, y2: innerTickMove};
      textProps = {
        x: 0,
        y: tickSpacingMove,
        dy: sign < 0 ? '0em' : '.71em',
        style: {textAnchor: 'middle'}
      };

      pathD = `M${rangeStart},${outerTickMove}V0H${rangeEnd}V${outerTickMove}`;
    } else {
      tickTransform = d => `translate(0,${scale(d)})`;
      lineProps = {x2: innerTickMove, y2: 0};
      textProps = {
        x: tickSpacingMove,
        y: 0,
        dy: '.32em',
        style: {textAnchor: sign < 0 ? 'end' : 'start'}
      };

      pathD = `M${outerTickMove},${rangeStart}H0V${rangeEnd}H${outerTickMove}`;
    }

    const renderedTicks = ticks.map(d =>
      <g key={d} className="tick" transform={tickTransform(d)}>
        <line {...lineProps} />
        <text {...textProps}>
          {tickFormat ? tickFormat(d) : d}
        </text>
      </g>
    );

    return (
      <g {...props}>
        {renderedTicks}
        <path className="domain" d={pathD} />
        {children}
      </g>
    );
  }
}
