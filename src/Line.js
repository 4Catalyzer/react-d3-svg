import d3 from 'd3';
import React from 'react';

export default class Line extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    x: React.PropTypes.func,
    y: React.PropTypes.func,
    defined: React.PropTypes.func,
    interpolate: React.PropTypes.string,
    tension: React.PropTypes.string
  };

  render() {
    const {data, x, y, defined, interpolate, tension, ...props} = this.props;

    const line = d3.svg.line();

    if (x) {
      line.x(x);
    }
    if (y) {
      line.y(y);
    }
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
