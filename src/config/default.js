'use strict'

const Joi = require('joi')
const urlRegex = /^(http|https)/

exports.defaultConfig = {
  url: "''",
  urls: [],
  requestOptions: {
    timeout: 10 * 1000,
    gzip: true
  },
  beforeRequest: function() { return Promise.resolve({}) },
  afterProcessed: function(res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  printRequestUrl: true,
  promiseLimit: 3,
  randomWait: 5,
  process: function({ $, url, error, createdAt }) {
    if (error) throw Error(error)
    throw Error('Missing implementation')
  },
  next: {
    key: "''",
    process: function({ $, url, error, createdAt, prevRes }) {
      if (error) throw Error(error)
      throw Error('Missing implementation')
    }
  },
  finally: function(res) {
    throw Error('Missing implementation')
  },
  catch: function(err) {
    console.error(err)
  }
}

exports.configSchema = Joi.object().keys({
  url: Joi.string().regex(urlRegex).empty(''),
  urls: Joi.alternatives([
    Joi.array().items(Joi.string().regex(urlRegex)),
    Joi.func()
  ]),
  requestOptions: Joi.object(),
  beforeRequest: Joi.func(),
  afterProcessed: Joi.func(),
  debugRequest: Joi.boolean(),
  randomUserAgent: Joi.boolean(),
  printRequestUrl: Joi.boolean(),
  promiseLimit: Joi.number(),
  randomWait: Joi.number(),
  process: Joi.func().required(),
  prevRes: Joi.any().optional(),
  next: Joi.object().keys({
    key: Joi.string().empty(''),
    process: Joi.func()
  }),
  finally: Joi.func(),
  catch: Joi.func()
})
