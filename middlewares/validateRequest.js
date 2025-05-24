const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }
};

module.exports = validateRequest;
