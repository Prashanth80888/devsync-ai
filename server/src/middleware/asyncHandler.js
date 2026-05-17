/**
 * Express wrapper utility to completely eliminate the requirement of writing boilerplate
 * try-catch wrappers inside operational controllers. Forwards unhandled async promise rejections
 * automatically down into the global centralized Error Handling middleware stack.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;