export default function throttleAnimation(callback) {
  let pending = false;

  return () => {
    if (pending) {
      return;
    }
    pending = true;

    window.requestAnimationFrame(() => {
      pending = false;
      callback();
    });
  };
}
