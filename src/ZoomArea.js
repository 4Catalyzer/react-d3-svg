import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import cloneChildren from './utils/cloneChildren';

export default class ZoomArea extends React.Component {
  static propTypes = {
    zoom: React.PropTypes.func.isRequired,
    onZoom: React.PropTypes.func,
    clipPathId: React.PropTypes.string,
    children: React.PropTypes.node
  };

  static contextTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    redraw: React.PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const {zoom} = props;
    const x = zoom.x();
    const y = zoom.y();

    if (x) {
      const xRange = x.range();
      this.xRangeSize = xRange[1] - xRange[0];
    } else {
      this.xRangeSize = null;
    }

    if (y) {
      const yRange = y.range();
      this.yRangeSize = yRange[0] - yRange[1];
    } else {
      this.yRangeSize = null;
    }

    // TODO: Handle when zoom object changes.
    zoom.on('zoom', () => {
      const {onZoom} = this.props;
      if (onZoom) {
        onZoom();
      }

      this.context.redraw();
    });
  }

  componentWillMount() {
    this.syncZoom();
  }

  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this)).call(this.props.zoom);
  }

  componentWillUpdate() {
    this.syncZoom();
  }

  syncZoom() {
    const {zoom} = this.props;

    // Setting zoom axes resets scale and translate, so we need to preserve the
    // old ones.
    const scale = zoom.scale();
    const translate = zoom.translate();

    zoom.scale(1);
    zoom.translate([0, 0]);

    const x = zoom.x();
    if (x) {
      // Translate is in range units; preserve domain translation here.
      const xRange = x.range();
      const nextXRangeSize = xRange[1] - xRange[0];
      if (this.xRangeSize) {
        translate[0] *= nextXRangeSize / this.xRangeSize;
      }
      this.xRangeSize = nextXRangeSize;

      zoom.x(x);
    }

    const y = zoom.y();
    if (y) {
      // Translate is in range units; preserve domain translation here.
      const yRange = y.range();
      const nextYRangeSize = yRange[0] - yRange[1];
      if (this.yRangeSize) {
        translate[1] *= nextYRangeSize / this.yRangeSize;
      }
      this.yRangeSize = nextYRangeSize;

      zoom.y(y);
    }

    // Restore the previous zoom settings.
    zoom.scale(scale);
    zoom.translate(translate);
  }

  render() {
    const {clipPathId, children, ...props} = this.props;
    const {width, height} = this.context;

    let clipPath;
    let clipPathDef;
    if (clipPathId) {
      clipPath = `url(#${clipPathId})`;
      clipPathDef = (
        <defs>
          <clipPath id={clipPathId}>
            <rect width={width} height={height} />
          </clipPath>
        </defs>
      );
    }

    return (
      <g clipPath={clipPath} {...props}>
        {clipPathDef}

        <rect
          width={width} height={height}
          fill="none" style={{pointerEvents: 'all'}}
        />

        {cloneChildren(children)}
      </g>
    );
  }
}
