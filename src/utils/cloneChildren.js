import React from 'react';

// FIXME: Remove once fix for facebook/react#4218 is released.
export default function cloneChildren(children) {
  return React.Children.map(children, child => React.cloneElement(child, {}));
}
