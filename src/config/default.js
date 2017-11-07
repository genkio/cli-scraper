'use strict'

const Joi = require('joi')
const { MESSAGES, BOT_UA } = require('../misc/constants')

exports.defaultConfig = {
  url: '',
  urls: [],
  beforeRequest() { return {} },
  afterProcessed(res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  promiseLimit: 3,
  process({ $, url, error }) { throw Error(MESSAGES.ERROR.MISSING_IMPL) },
  prevRes: {},
  next: {
    url: '',
    process({ $, url, error, prevRes }) { throw Error(MESSAGES.ERROR.MISSING_IMPL) }
  }
}

exports.configSchema = Joi.object().keys({
  url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  urls: Joi.array().items(Joi.string().uri({ scheme: ['http', 'https'] })),
  beforeRequest: Joi.func(),
  afterProcessed: Joi.func(),
  debugRequest: Joi.boolean(),
  randomUserAgent: Joi.boolean(),
  promiseLimit: Joi.number(),
  process: Joi.func().required(),
  prevRes: Joi.object(),
  next: Joi.object().keys({
    url: Joi.string().empty(''),
    process: Joi.func()
  })
})

exports.requestBaseConfig = {
  headers: { 'User-Agent': BOT_UA.GBOT },
  timeout: 1000 * 10,
  gzip: true
}
