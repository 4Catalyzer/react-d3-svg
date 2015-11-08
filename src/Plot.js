import React from 'react';
import ReactDOM from 'react-dom';

import throttleAnimation from './utils/throttleAnimation';

export default class Plot extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    marginTop: React.PropTypes.number.isRequired,
    marginRight: React.PropTypes.number.isRequired,
    marginBottom: React.PropTypes.number.isRequired,
    marginLeft: React.PropTypes.number.isRequired,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    children: React.PropTypes.node
  };

  static childContextTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    marginTop: React.PropTypes.number.isRequired,
    marginRight: React.PropTypes.number.isRequired,
    marginBottom: React.PropTypes.number.isRequired,
    marginLeft: React.PropTypes.number.isRequired,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    redraw: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  };

  constructor(props, context) {
    super(props, context);

    const {width, height} = props;
    this.state = {width, height};

    this.hasResizeListener = false;
    this.needsRedraw = false;
  }

  getChildContext() {
    const {width, height} = this.getBodyDimensions();
    const {
      marginTop, marginRight, marginLeft, marginBottom,
      xScale, yScale
    } = this.props;
    const {redraw} = this;

    return {
      width, height,
      marginTop, marginRight, marginLeft, marginBottom,
      xScale, yScale,
      redraw
    };
  }

  componentWillMount() {
    this.updateScales(this.props, this.state);
  }

  componentDidMount() {
    this.updateSize();
    this.syncResizeListener();
  }

  componentWillReceiveProps({width, height}) {
    if (width != null) {
      this.setState({width});
    }
    if (height != null) {
      this.setState({height});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.updateScales(nextProps, nextState);
  }

  componentDidUpdate() {
    this.syncResizeListener();
    this.needsRedraw = false;
  }

  componentWillUnmount() {
    this.removeResizeListener();
  }

  onResize = throttleAnimation(() => {
    this.updateSize();
  });

  getBodyDimensions({width: totalWidth, height: totalHeight} = this.state) {
    let width;
    let height;

    if (totalWidth != null) {
      const {marginLeft, marginRight} = this.props;
      width = totalWidth - marginLeft - marginRight;
    }
    if (totalHeight != null) {
      const {marginTop, marginBottom} = this.props;
      height = totalHeight - marginTop - marginBottom;
    }

    return {width, height};
  }

  updateScales({xScale, yScale}, state) {
    const {width, height} = this.getBodyDimensions(state);
    if (xScale && width != null) {
      xScale.range([0, width]);
    }
    if (yScale && height != null) {
      yScale.range([height, 0]);
    }
  }

  updateSize() {
    const {width: propsWidth, height: propsHeight} = this.props;
    if (propsWidth != null && propsHeight != null) {
      return;
    }

    const {width: lastWidth, height: lastHeight} = this.state;
    const {width, height} = ReactDOM.findDOMNode(this).getBoundingClientRect();

    if (propsWidth == null && width !== lastWidth) {
      this.setState({width});
    }
    if (propsHeight == null && height !== lastHeight) {
      this.setState({height});
    }
  }

  syncResizeListener() {
    const {width, height} = this.props;
    if (width == null || height == null) {
      this.addResizeListener();
    } else {
      this.removeResizeListener();
    }
  }

  addResizeListener() {
    if (!this.hasResizeListener) {
      // FIXME: Use proper element resize detection.
      window.addEventListener('resize', this.onResize);
      this.hasResizeListener = true;
    }
  }

  removeResizeListener() {
    if (this.hasResizeListener) {
      window.removeEventListener('resize', this.onResize);
      this.hasResizeListener = false;
    }
  }

  redraw = () => {
    this.needsRedraw = true;

    // Only redraw if we haven't otherwise re-rendered.
    this.redrawIfNeeded();
  };

  redrawIfNeeded = throttleAnimation(() => {
    if (!this.needsRedraw) {
      return;
    }
    this.forceUpdate();
  });

  render() {
    const {marginTop, marginLeft, children, ...props} = this.props;
    const {width, height} = this.state;

    let plotBody;
    if (width != null && height != null) {
      plotBody = (
        <g transform={`translate(${marginLeft},${marginTop})`}>
          {children}
        </g>
      );
    }

    return (
      <svg {...props}>
        {plotBody}
      </svg>
    );
  }
}
