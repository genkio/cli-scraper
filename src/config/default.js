'use strict'

const { MESSAGES, BOT_UA } = require('../misc/constants')

exports.defaultConfig = {
  url: '',
  beforeRequest() { return {} },
  afterProcessed(res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  promiseLimit: 3,
  process(res) { throw Error(MESSAGES.ERROR.MISSING_IMPL) },
  next: {
    url: '',
    process(res) { throw Error(MESSAGES.ERROR.MISSING_IMPL) }
  }
}

exports.requestConfig = {
  headers: { 'User-Agent': BOT_UA },
  timeout: 1000 * 10,
  gzip: true
}
