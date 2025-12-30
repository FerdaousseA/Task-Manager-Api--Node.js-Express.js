const Joi = require('joi');

exports.createTaskValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('pending', 'in_progress', 'completed').default('pending')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

exports.updateTaskValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('pending', 'in_progress', 'completed')
  }).min(1); // Au moins un champ doit être présent

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};