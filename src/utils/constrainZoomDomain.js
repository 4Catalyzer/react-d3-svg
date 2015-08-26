// This isn't used by the rest of this library, but it's a broadly useful
// utility, so I'm putting it here for my benefit.

const EVENT_TYPE = 'zoom.constrainDomain';

export default function constrainZoomDomain(zoom) {
  // This is a no-op if applied more than once.
  if (zoom.on(EVENT_TYPE)) {
    return;
  }

  // Don't let user zoom out beyond initial domain - otherwise constraining
  // the domain doesn't make sense.
  const [scaleMin, scaleMax] = zoom.scaleExtent();
  zoom.scaleExtent([Math.max(scaleMin, 1), scaleMax]);

  // TODO: Handle the scale objects changing.
  const xScale = zoom.x();
  let xMax;
  if (xScale) {
    xMax = xScale.domain()[1];
  }
  const yScale = zoom.y();
  let yMin;
  if (yScale) {
    yMin = yScale.domain()[0];
  }

  zoom.on(EVENT_TYPE, () => {
    const [xTranslate, yTranslate] = zoom.translate();
    let nextXTranslate = xTranslate;
    let nextYTranslate = yTranslate;

    if (xScale) {
      if (xTranslate > 0) {
        nextXTranslate = 0;
      } else {
        const currentXMax = xScale.domain()[1];
        if (currentXMax > xMax) {
          nextXTranslate += xScale.range()[1] - xScale(xMax);

          if (nextXTranslate > -1e-9) {
            // Snap to range start if we're near it.
            nextXTranslate = 0;
          } else {
            // Otherwise apply a small shift to include the range end.
            nextXTranslate -= 1e-9;
          }
        }
      }
    }

    if (yScale) {
      if (yTranslate > 0) {
        nextYTranslate = 0;
      } else {
        const currentYMin = yScale.domain()[0];
        if (currentYMin < yMin) {
          nextYTranslate += yScale.range()[0] - yScale(yMin);

          if (nextYTranslate > -1e-9) {
            // Snap to range end if we're near it.
            nextYTranslate = 0;
          } else {
            // Otherwise apply a small shift to include the range start.
            nextYTranslate -= 1e-9;
          }
        }
      }
    }

    zoom.translate([nextXTranslate, nextYTranslate]);
  });
}
