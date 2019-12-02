export default function(func, time) {
  let timeout;
  time = time || 250;
  return (...args) => {
    let context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, time);
  }
}