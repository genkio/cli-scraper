'use strict'

const Joi = require('joi')
const { BOT } = require('../misc/ua')

exports.defaultConfig = {
  url: '',
  urls: [],
  beforeRequest() { return {} },
  afterProcessed(res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  promiseLimit: 3,
  randomWait: 5,
  process({ $, url, error, createdAt }) { throw Error('Missing implementation') },
  prevRes: {},
  next: {
    url: '',
    process({ $, url, error, createdAt, prevRes }) { throw Error('Missing implementation') }
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
  randomWait: Joi.number(),
  process: Joi.func().required(),
  prevRes: Joi.object(),
  next: Joi.object().keys({
    url: Joi.string().empty(''),
    process: Joi.func()
  })
})

exports.requestBaseConfig = {
  headers: { 'User-Agent': BOT.GOOGLE },
  timeout: 1000 * 10,
  gzip: true
}
