export default function throttle(callback) {
  let pending = false;

  return (...args) => {
    if (pending) {
      return;
    }
    pending = true;

    window.requestAnimationFrame(() => {
      pending = false;
      callback(...args);
    });
  };
}
