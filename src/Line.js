import d3 from 'd3';
import React from 'react';

export default class Line extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    xKey: React.PropTypes.any.isRequired,
    yKey: React.PropTypes.any.isRequired,
    defined: React.PropTypes.func,
    interpolate: React.PropTypes.string,
    tension: React.PropTypes.string
  };

  static contextTypes = {
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func
  };

  static defaultProps = {
    xKey: 0,
    yKey: 1
  };

  render() {
    const {
      data, xKey, yKey,
      defined, interpolate, tension,
      ...props
    } = this.props;

    const xScale = this.props.xScale || this.context.xScale;
    const yScale = this.props.yScale || this.context.yScale;

    const line = d3.svg.line()
      .x(d => xScale(d[xKey]))
      .y(d => yScale(d[yKey]));

    if (defined) {
      line.defined(defined);
    }
    if (interpolate) {
      line.interpolate(interpolate);
    }
    if (tension) {
      line.tension(tension);
    }

    return (
      <path d={line(data)} {...props} />
    );
  }
}
