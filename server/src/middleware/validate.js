export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source] ?? {});
      if (source === 'query') {
        req.validatedQuery = parsed;
      } else {
        req[source] = parsed;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
