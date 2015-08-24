import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import * as PropTypes from './PropTypes';
import cloneChildren from './utils/cloneChildren';
import transforms from './utils/transforms';

export default class ZoomArea extends React.Component {
  static propTypes = {
    zoom: React.PropTypes.func.isRequired,
    region: PropTypes.region.isRequired,
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

    // TODO: Handle the zoom object changing.
    zoom.on('zoom.redraw', this.context.redraw);
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

        {cloneChildren(children)}
      </g>
    );
  }
}
