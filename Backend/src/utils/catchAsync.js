/**
 * Wrapper for async functions to automatically catch errors and pass them to next().
 * This eliminates the need for repetitive try-catch blocks in controllers.
 * 
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} - A middleware function.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
