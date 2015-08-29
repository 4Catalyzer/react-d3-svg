import invariant from 'invariant';
import shallowEqual from 'react-pure-render/shallowEqual';

function getScaleValues(scale) {
  if (!scale) {
    return null;
  }

  return {
    domain: scale.domain(),
    range: scale.range()
  };
}

function updateScaleValues(element, context) {
  element._xScaleValues = getScaleValues(context.xScale);
  element._yScaleValues = getScaleValues(context.yScale);
}

function componentWillMount() {
  updateScaleValues(this, this.context);
}

function createChainedComponentWillMount(originalComponentWillMount) {
  return function chainedComponentWillMount() {
    originalComponentWillMount.call(this);
    componentWillMount.call(this);
  };
}

function scaleValuesEqual(scaleValues, scale) {
  if (!scaleValues) {
    // Already checked for shallow equality before this.
    return true;
  }

  const {domain, range} = scaleValues;
  const nextDomain = scale.domain();
  const nextRange = scale.range();

  return domain[0] === nextDomain[0] &&
    domain[1] === nextDomain[1] &&
    range[0] === nextRange[0] &&
    range[1] === nextRange[1];
}

function shouldComponentUpdate(nextProps, nextState, nextContext) {
  const hasChange =
    !shallowEqual(this.props, nextProps) ||
    !shallowEqual(this.state, nextState) ||
    !shallowEqual(this.context, nextContext) ||
    !scaleValuesEqual(this._xScaleValues, nextContext.xScale) ||
    !scaleValuesEqual(this._yScaleValues, nextContext.yScale);
  if (hasChange) {
    updateScaleValues(this, nextContext);
    return true;
  }

  return false;
}

export default function purePlotClass(Component) {
  const componentName = Component.displayName || Component.name;
  invariant(
    Component.prototype,
    `pureRelayClass: \`${componentName}\` does not have a prototype`
  );
  invariant(
    !Component.prototype.shouldComponentUpdate,
    `pureRelayClass: \`${componentName}\` already has ` +
    `\`shouldComponentUpdate\``
  );

  const originalComponentWillMount = Component.prototype.componentWillMount;
  if (originalComponentWillMount) {
    Component.prototype.componentWillMount =
      createChainedComponentWillMount(originalComponentWillMount);
  } else {
    Component.prototype.componentWillMount = componentWillMount;
  }

  Component.prototype.shouldComponentUpdate = shouldComponentUpdate;
}
