// This isn't used by the rest of this library, but it's a broadly useful
// utility, so I'm putting it here for my benefit.

export default function updateZoomDomain(zoom) {
  const scale = zoom.scale();
  const translate = zoom.translate();

  const x = zoom.x();
  if (x) {
    zoom.x(x);
  }

  const y = zoom.y();
  if (y) {
    zoom.y(y);
  }

  // Restore original scaling and translation.
  zoom.scale(scale);
  zoom.translate(translate);
}
