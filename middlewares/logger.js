export default function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const agora = new Date().toISOString();
    const metodo = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`[${agora}] ${metodo} ${url} ${status} - ${duration}ms`);
  });

  next();
}