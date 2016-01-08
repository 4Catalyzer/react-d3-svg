import invariant from 'invariant';
import shallowEqual from 'react-pure-render/shallowEqual';

function getScaleValues(scale) {
  if (!scale) {
    return null;
  }

  return {
    domain: scale.domain(),
    range: scale.range(),
  };
}

function updateScaleValues(values, spec) {
  const scaleValues = {};
  Object.keys(spec).forEach(key => {
    scaleValues[key] = getScaleValues(spec[key](values));
  });

  this._scaleValues = scaleValues;
}

function createComponentWillMount(spec) {
  return function componentWillMount() {
    updateScaleValues.call(this, this, spec);
  };
}

function createChainedComponentWillMount(original, spec) {
  return function componentWillMount() {
    original.call(this);
    updateScaleValues.call(this, this, spec);
  };
}

function isScaleEqual(scale, scaleValues) {
  const nextDomain = scale.domain();
  const nextRange = scale.range();
  const { domain, range } = scaleValues;

  return nextDomain[0] === domain[0] &&
    nextDomain[1] === domain[1] &&
    nextRange[0] === range[0] &&
    nextRange[1] === range[1];
}

function createShouldComponentUpdate(spec) {
  return function shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.shouldUpdate != null) {
      return nextProps.shouldUpdate;
    }

    const nextValues = {
      props: nextProps,
      state: nextState,
      context: nextContext,
    };

    const hasChange =
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext) ||
      Object.keys(spec).some(key =>
        !isScaleEqual(spec[key](nextValues), this._scaleValues[key])
      );

    if (hasChange) {
      updateScaleValues.call(this, nextValues, spec);
      return true;
    }

    return false;
  };
}

let defaultPurePlotDecorator;

export default function purePlotClass(spec) {
  // Use scales from context if given a component.
  if (spec instanceof Function) {
    return defaultPurePlotDecorator(spec);
  }

  return function purePlotDecorator(Component) {
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
    let componentWillMount;
    if (originalComponentWillMount) {
      componentWillMount =
        createChainedComponentWillMount(originalComponentWillMount, spec);
    } else {
      componentWillMount = createComponentWillMount(spec);
    }

    const shouldComponentUpdate = createShouldComponentUpdate(spec);

    // Mutating the class in-place avoids edge conditions with copying.
    Object.assign(Component.prototype, {
      componentWillMount, shouldComponentUpdate,
    });
  };
}

defaultPurePlotDecorator = purePlotClass({
  xScale: ({ context }) => context.xScale,
  yScale: ({ context }) => context.yScale,
});
