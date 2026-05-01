const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      console.log('Validation failed:', errors);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    next(error);
  }
};

module.exports = { validate };
