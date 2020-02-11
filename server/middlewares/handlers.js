const { logger } = require("../libs");

module.exports.Handlers = {
  unfound: () => {
    return async (req, res, next) => {
      res.status(404).json({ message: "Not found" });
    };
  },
  errors: () => {
    return async (err, req, res, next) => {
      console.error("%O", err);
      const code = [
        "SequelizeUniqueConstraintError",
        "SequelizeValidationError"
      ].includes(err.name)
        ? 400
        : err.status || 500;
      if (err.errors && err.errors[0].message) {
        res.status(code).json({ message: err.errors[0].message });
      } else if (
        err.response &&
        (err.response.data || err.response.statusText)
      ) {
        res
          .status(err.response.status || code)
          .json(err.response.data || { message: err.message });
      } else {
        res.status(code).json({ message: err.message });
      }
    };
  }
};
