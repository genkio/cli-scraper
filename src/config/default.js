'use strict'

const { MESSAGES } = require('../misc/constants')

module.exports = {
  url: '',
  requestOptions: {},
  requestDebug: false,
  randomUserAgent: false,
  process(res) { throw Error(MESSAGES.ERROR.MISSING_IMPL) },
  next: {
    url: '',
    requestOptions: {},
    requestDebug: false,
    randomUserAgent: false,
    parallel: false,
    sequential: true,
    promiseLimit: 3,
    process(res) { throw Error(MESSAGES.ERROR.MISSING_IMPL) }
  },
  exclude(item) {}
}
