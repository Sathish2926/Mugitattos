module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', { status, message, stack: err.stack });
  }
  res.status(status).json({ error: message });
};
