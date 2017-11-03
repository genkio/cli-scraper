'use strict'

const _ = require('lodash')
const request = require('request')
// request.debug = true
const C = require('../misc/constants')

module.exports = config => {
  return new Promise((resolve, reject) => {
    request.debug = config.requestDebug

    const options = getRequestOptions(config)
    const crawl = getCrawler(config)
    const target = config.prevRes || options.url

    crawl(options, (error, response, body) => {
      const { statusCode } = response
      const oops = error || (statusCode >= 300)
      if (oops) {
        console.log(C.MESSAGES.FAILED_TO_CRAWL(statusCode, JSON.stringify(target)))
      }
      resolve(_.merge(config, { html: body }))
    })
  })
}

function getRequestOptions(config) {
  let { url, requestOptions } = config
  if (!url || typeof url !== 'string') {
    throw TypeError(C.MESSAGES.ERROR.MISSING_URL)
  }
  if (url.indexOf('http') < 0) {
    throw TypeError(C.MESSAGES.ERROR.MISSING_PROTOCOL)
  }
  return _.merge(requestOptions, { url })
}

function getCrawler(config) {
  const { randomUserAgent } = config
  const defaultOptions = {
    headers: { 'User-Agent': C.BOT_UA },
    timeout: 1000 * 60,
    gzip: true
  }
  if (randomUserAgent) {
    defaultOptions.headers['User-Agent'] = getRandomUserAgent()
  }

  return request.defaults(defaultOptions)
}

function getRandomUserAgent() {
  return C.UA[Math.floor(Math.random() * (C.UA.length - 1))]
}
