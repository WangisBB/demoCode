const cubic = (value) => Math.pow(value, 3);
const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
let requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// because it's so fucking difficult to detect the scrolling element, just move them all
function move(amount) {
  document.documentElement.scrollTop = amount;
  document.body.parentNode.scrollTop = amount;
  document.body.scrollTop = amount;
}

function position() {
  return (
    document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop
  );
}

export function scrollTo(to, duration, callback) {
  const start = position(),
    oldTime = Date.now(),
    change = to - start;
  if (change === 0) return;
  duration = typeof duration === "undefined" ? 500 : duration;
  let animateScroll = function () {
    const progress = (Date.now() - oldTime) / duration;
    if (progress < 1) {
      let val = start + easeInOutCubic(progress) * change;
      move(val);
      requestAnimFrame(animateScroll);
    } else {
      move(to);
      if (callback && typeof callback === "function") {
        callback();
      }
    }
  };
  animateScroll();
}
