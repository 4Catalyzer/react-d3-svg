import React from 'react';

export default class PlotCanvas extends React.Component {
  static propTypes = {
    onRedraw: React.PropTypes.func.isRequired,
  };

  static contextTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const ctx = this.refs.canvas.getContext('2d');
    const { width, height } = this.context;

    ctx.clearRect(0, 0, width, height);
    this.props.onRedraw(ctx);
  }

  render() {
    const { width, height } = this.context;

    return (
      <canvas
        ref="canvas"
        width={width} height={height}
        {...this.props}
      />
    );
  }
}
