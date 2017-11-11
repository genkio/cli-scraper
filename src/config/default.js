'use strict'

const Joi = require('joi')
const { BOT } = require('../misc/ua')
const urlRegex = /^(http|https)/

exports.defaultConfig = {
  url: "''",
  urls: [],
  beforeRequest: function() { return {} },
  afterProcessed: function(res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  printRequestUrl: true,
  promiseLimit: 3,
  randomWait: 5,
  process: function({ $, url, error, createdAt }) {
    throw Error('Missing implementation')
  },
  next: {
    key: "''",
    process: function({ $, url, error, createdAt, prevRes }) {
      throw Error('Missing implementation')
    }
  },
  finally: function(res) {
    throw Error('Missing implementation')
  }
}

exports.configSchema = Joi.object().keys({
  url: Joi.string().regex(urlRegex).empty(''),
  urls: Joi.array().items(Joi.string().regex(urlRegex)),
  beforeRequest: Joi.func(),
  afterProcessed: Joi.func(),
  debugRequest: Joi.boolean(),
  randomUserAgent: Joi.boolean(),
  printRequestUrl: Joi.boolean(),
  promiseLimit: Joi.number(),
  randomWait: Joi.number(),
  process: Joi.func().required(),
  prevRes: Joi.object().optional(),
  next: Joi.object().keys({
    key: Joi.string().empty(''),
    process: Joi.func()
  }),
  finally: Joi.func()
})

exports.requestBaseConfig = {
  headers: { 'User-Agent': BOT.GOOGLE },
  timeout: 1000 * 10,
  gzip: true
}
