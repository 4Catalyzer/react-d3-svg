export default function debounceAnimation(callback) {
  let handle = null;

  return () => {
    if (handle !== null) {
      window.cancelAnimationFrame(handle);
    }

    // Delay two frames; otherwise this would fire immediately as we get up to
    // the redraw time.
    handle = window.requestAnimationFrame(() => {
      handle = window.requestAnimationFrame(() => {
        handle = null;
        callback();
      });
    });
  };
}
