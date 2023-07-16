const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, //Limit each ip to login request per window and per minute
  message: {
    message:
      'Too many Login attempts from this IP, please try again after a 60 second pause',
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Message: ${options.message.message}\nRequest Method: ${req.method}\nRequest Url: ${req.url}\nRequest Headers Origin: ${req.headers.origin}`,
      'errLog.log'
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // disable the X-RateLimit-* headers
});

module.exports = loginLimiter;
