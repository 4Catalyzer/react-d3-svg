import React from 'react';
import Plot from './Plot';

// TODO: Use PlotCanvas component once Chrome fixes foreignObject rendering.

export default class PlotWithCanvas extends Plot {
  static propTypes = {
    ...Plot.propTypes,

    onRedrawCanvas: React.PropTypes.func,

    // Placate ESLint.
    marginTop: Plot.propTypes.marginTop,
    marginLeft: Plot.propTypes.marginLeft
  };

  static childContextTypes = Plot.childContextTypes;
  static defaultProps = Plot.defaultProps;

  componentDidMount() {
    super.componentDidMount();
    this.redrawCanvas();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.redrawCanvas();
  }

  redrawCanvas() {
    if (!this.refs.canvas) {
      return;
    }

    const ctx = this.refs.canvas.getContext('2d');

    const {width, height} = this.getBodyDimensions();
    ctx.clearRect(0, 0, width, height);

    if (!this.props.onRedrawCanvas) {
      return;
    }

    this.props.onRedrawCanvas(ctx);
  }

  render() {
    const {width, height} = this.state;

    let canvas;
    if (width != null && height != null) {
      const {marginTop, marginLeft} = this.props;
      canvas = (
        <canvas
          ref="canvas"
          {...this.getBodyDimensions()}
          style={{
            position: 'absolute',
            top: marginTop,
            left: marginLeft,
            zIndex: -1
          }}
        />
      );
    } else {
      canvas = null;
    }

    return (
      <div style={{position: 'relative'}}>
        {canvas}
        {super.render()}
      </div>
    );
  }
}
