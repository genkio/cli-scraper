'use strict'

const Joi = require('joi')

exports.validate = (target, schema) => {
  const result = Joi.validate(target, schema)
  if (result.error) throw Error(result.error)
}

exports.stringify = obj => {
  const placeholder = '____PLACEHOLDER____'
  let fns = []
  let json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value)
      return placeholder
    }
    return value
  }, 2)
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift()
  })
  return `exports.config = ${json}`
    .replace(/"/g, '')
}
