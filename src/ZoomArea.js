import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import {regionType} from './PropTypes';
import './utils/patchReactReconciler';
import transforms from './utils/transforms';

const REDRAW_EVENT_TYPE = 'zoom.redraw';

export default class ZoomArea extends React.Component {
  static propTypes = {
    zoom: React.PropTypes.func.isRequired,
    region: regionType.isRequired,
    clipPathId: React.PropTypes.string,
    transform: React.PropTypes.string,
    children: React.PropTypes.node
  };

  static contextTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    marginTop: React.PropTypes.number.isRequired,
    marginRight: React.PropTypes.number.isRequired,
    marginBottom: React.PropTypes.number.isRequired,
    marginLeft: React.PropTypes.number.isRequired,
    redraw: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    region: 'center'
  };

  constructor(props, context) {
    super(props, context);

    // Need to do initial sync in case range was updated after zoom was linked.
    this.xRange = null;
    this.yRange = null;
    this.syncZoomRange();

    // TODO: Handle the zoom object changing.
    const {zoom} = props;
    let i = 0;
    while (zoom.on(`${REDRAW_EVENT_TYPE}.${i}`)) {
      ++i;
    }
    zoom.on(`${REDRAW_EVENT_TYPE}.${i}`, this.context.redraw);
  }

  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this)).call(this.props.zoom);
  }

  componentWillUpdate() {
    this.syncZoomRange();
  }

  syncZoomRange() {
    const {zoom} = this.props;
    const x = zoom.x();
    const y = zoom.y();

    const hasXChange = this.hasRangeChange(x, this.xRange);
    const hasYChange = this.hasRangeChange(y, this.yRange);
    if (!hasXChange && !hasYChange) {
      return;
    }

    // Setting zoom axes resets scale and translate, so we need to preserve the
    // old ones.
    const scale = zoom.scale();
    const translate = zoom.translate();

    zoom.scale(1);
    zoom.translate([0, 0]);

    if (hasXChange) {
      // Translate is in range units; preserve domain translation here.
      const nextXRange = x.range();
      if (this.xRange) {
        const nextXRangeSize = nextXRange[1] - nextXRange[0];
        const xRangeSize = this.xRange[1] - this.xRange[0];
        translate[0] *= nextXRangeSize / xRangeSize;
      }
      this.xRange = nextXRange;

      zoom.x(x);
    }

    if (hasYChange) {
      // Translate is in range units; preserve domain translation here.
      const nextYRange = y.range();
      if (this.yRange) {
        const nextYRangeSize = nextYRange[0] - nextYRange[1];
        const yRangeSize = this.yRange[0] - this.yRange[1];
        translate[1] *= nextYRangeSize / yRangeSize;
      }
      this.yRange = nextYRange;

      zoom.y(y);
    }

    // Restore the previous zoom settings.
    zoom.scale(scale);
    zoom.translate(translate);
  }

  hasRangeChange(scale, range) {
    if (!scale) {
      return false;
    }

    if (!range) {
      return true;
    }

    const nextRange = scale.range();
    return nextRange[0] !== range[0] || nextRange[1] !== range[1];
  }

  calculatePosition() {
    const {region} = this.props;

    let {width, height} = this.context;
    if (region === 'center') {
      return {width, height};
    }

    let xTranslate = 0;
    let yTranslate = 0;

    if (region === 'top') {
      const {marginTop} = this.context;
      yTranslate = -marginTop;
      height = marginTop;
    } else if (region === 'right') {
      const {marginRight} = this.context;
      xTranslate = width;
      width = marginRight;
    } else if (region === 'bottom') {
      const {marginBottom} = this.context;
      yTranslate = height;
      height = marginBottom;
    } else if (region === 'left') {
      const {marginLeft} = this.context;
      xTranslate = -marginLeft;
      width = marginLeft;
    }

    return {
      positionTransform: `translate(${xTranslate},${yTranslate})`,
      width, height
    };
  }

  render() {
    const {clipPathId, transform, children, ...props} = this.props;
    const {positionTransform, width, height} = this.calculatePosition();

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
      <g
        transform={transforms(transform, positionTransform)}
        clipPath={clipPath}
        {...props}
      >
        {clipPathDef}

        <rect
          width={width} height={height}
          fill="none" style={{pointerEvents: 'all'}}
        />

        {children}
      </g>
    );
  }
}
