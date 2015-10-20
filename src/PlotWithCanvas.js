import React from 'react';

import Plot from './Plot';

// TODO: Use PlotCanvas component once Chrome fixes foreignObject rendering.

export default class PlotWithCanvas extends Plot {
  static propTypes = {
    ...Plot.propTypes,

    canvas: React.PropTypes.node,

    // Placate ESLint.
    marginTop: Plot.propTypes.marginTop,
    marginLeft: Plot.propTypes.marginLeft
  };

  static childContextTypes = Plot.childContextTypes;
  static defaultProps = Plot.defaultProps;

  render() {
    const {canvas} = this.props;
    if (!canvas) {
      return super.render();
    }

    const {width, height} = this.state;

    let canvasHolder;
    if (width != null && height != null) {
      const {marginTop, marginLeft} = this.props;
      canvasHolder = (
        <div style={{
          position: 'absolute',
          top: marginTop,
          left: marginLeft,
          zIndex: -1
        }}>
          {canvas}
        </div>
      );
    }

    return (
      <div style={{position: 'relative'}}>
        {canvasHolder}
        {super.render()}
      </div>
    );
  }
}
