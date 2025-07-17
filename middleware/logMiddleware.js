const logMiddleware = (req, res, next) => {
  const time = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const url = req.originalUrl;

  console.log(`[ ${time} ] (${method}) -> ${path} | ${url}`);
  next();
};

export default logMiddleware;