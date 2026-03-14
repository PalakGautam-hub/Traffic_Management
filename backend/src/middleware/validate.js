const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateTrafficData = [
  body("junction_id").isUUID().withMessage("Valid junction_id is required"),
  body("cars").isInt({ min: 0 }).withMessage("cars must be a non-negative integer"),
  body("bikes").isInt({ min: 0 }).withMessage("bikes must be a non-negative integer"),
  body("buses").isInt({ min: 0 }).withMessage("buses must be a non-negative integer"),
  body("trucks").isInt({ min: 0 }).withMessage("trucks must be a non-negative integer"),
  body("total").isInt({ min: 0 }).withMessage("total must be a non-negative integer"),
  body("density").isIn(["Low", "Medium", "High"]).withMessage("density must be Low, Medium, or High"),
  body("green_time").isInt({ min: 5 }).withMessage("green_time must be at least 5 seconds"),
  handleValidation,
];

const validateViolation = [
  body("junction_id").isUUID().withMessage("Valid junction_id is required"),
  body("vehicle_type").notEmpty().withMessage("vehicle_type is required"),
  body("image_url").optional().isURL().withMessage("image_url must be a valid URL"),
  handleValidation,
];

module.exports = { validateTrafficData, validateViolation };
