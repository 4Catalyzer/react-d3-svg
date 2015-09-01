// FIXME: Remove once fix for facebook/react#4218 is released.

import React from 'react';
import ReactReconciler from 'react/lib/ReactReconciler';
import ReactRef from 'react/lib/ReactRef';

if (React.version === '0.14.0-beta3') {
  // Version as of facebook/react#4a92860.

  /* eslint-disable */
  ReactReconciler.receiveComponent = function(
    internalInstance, nextElement, transaction, context
  ) {
    var prevElement = internalInstance._currentElement;

    if (nextElement === prevElement &&
        context === internalInstance._context
      ) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for an element created outside a composite to be
      // deeply mutated and reused.

      // TODO: Bailing out early is just a perf optimization right?
      // TODO: Removing the return statement should affect correctness?
      return;
    }

    var refsChanged = ReactRef.shouldUpdateRefs(
      prevElement,
      nextElement
    );

    if (refsChanged) {
      ReactRef.detachRefs(internalInstance, prevElement);
    }

    internalInstance.receiveComponent(nextElement, transaction, context);

    if (refsChanged) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
  };
  /* eslint-enable */
}
