'use strict'

const Joi = require('joi')

exports.validate = (target, schema) => {
  const result = Joi.validate(target, schema)
  if (result.error) throw Error(result.error)
}
