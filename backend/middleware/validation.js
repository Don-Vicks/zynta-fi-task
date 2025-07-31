const { z } = require('zod');

// Validation schemas
const registerSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string'
  })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine(val => val.length > 0, 'Name cannot be empty after trimming'),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  })
    .min(1, 'Email cannot be empty')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
  referralCode: z.union([
    z.string()
      .length(6, 'Referral code must be exactly 6 characters')
      .regex(/^[A-Z0-9]+$/, 'Referral code must contain only uppercase letters and numbers')
      .transform(val => val.toUpperCase()),
    z.undefined()
  ]).optional()
});

const referralCodeParamSchema = z.object({
  referralCode: z.string()
    .length(6, 'Referral code must be exactly 6 characters')
    .regex(/^[A-Z0-9]+$/, 'Referral code must contain only uppercase letters and numbers')
});


/**
 * Middleware to validate route parameters for referral code
 */
const validateReferralCodeParam = (req, res, next) => {
  try {
    // Validate the route parameter
    const validatedParams = referralCodeParamSchema.parse(req.params);
    
    // Replace req.params with validated data
    req.params = validatedParams;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code format',
        errors: errorMessages
      });
    }
    
    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation'
    });
  }
};

/**
 * Additional validation middleware for checking if request body exists
 */
const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is required',
      errors: [{
        field: 'body',
        message: 'Request body cannot be empty'
      }]
    });
  }
  next();
};

/**
 * Middleware to sanitize and validate JSON input
 */
const validateJSON = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      errors: [{
        field: 'body',
        message: 'Request body must be valid JSON'
      }]
    });
  }
  next(error);
};

/**
 * Enhanced validation function that provides detailed error messages
 */
const validateRegisterRequestEnhanced = (req, res, next) => {
  try {
    // First check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required',
        errors: [{
          field: 'body',
          message: 'Request body cannot be empty'
        }]
      });
    }

    // Validate the request body
    const validatedData = registerSchema.parse(req.body);
    
    // Replace req.body with validated and sanitized data
    req.body = validatedData;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        let message = err.message;
        
        // Provide more user-friendly error messages
        if (err.code === 'invalid_type' && err.expected === 'string') {
          message = `${err.path.join('.')} must be a text value`;
        }
        
        return {
          field: err.path.join('.') || 'unknown',
          message: message,
          code: err.code
        };
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    // Handle unexpected errors
    console.error('Validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation'
    });
  }
};

module.exports = {
  validateRegisterRequest: validateRegisterRequestEnhanced,
  validateReferralCodeParam,
  validateRequestBody,
  validateJSON
};
