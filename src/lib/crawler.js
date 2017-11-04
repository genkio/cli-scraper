'use strict'

const request = require('request')
const { requestConfig } = require('../config/default')
const C = require('../misc/constants')

module.exports = config => {
  return new Promise((resolve, reject) => {
    request.debug = config.requestDebug

    const userConfig = getUserRequestConfig(config)
    const crawl = getDefaultCrawler(config)

    crawl(userConfig, (error, response, body) => {
      if (error || (response.statusCode >= 300)) {
        console.error(C.MESSAGES.ERROR.FAILED_TO_CRAWL)
        if (response && response.request && response.request.href) {
          console.error(response.request.href)
        }
      }
      if (error) console.error(error.message)
      if (response && response.statusCode >= 300) console.error(response.statusCode)
      resolve({ url: response.request.href, html: (body || '') })
    })
  })
}

function getUserRequestConfig(config) {
  let { url, requestOptions } = config
  if (!url || typeof url !== 'string') {
    throw TypeError(C.MESSAGES.ERROR.MISSING_URL)
  }
  if (url.indexOf('http') < 0) {
    throw TypeError(C.MESSAGES.ERROR.MISSING_PROTOCOL)
  }
  return Object.assign(requestOptions, { url })
}

function getDefaultCrawler(config) {
  const { randomUserAgent } = config
  if (randomUserAgent) {
    requestConfig.headers['User-Agent'] = getRandomUserAgent()
  }

  return request.defaults(requestConfig)
}

function getRandomUserAgent() {
  return C.UA[Math.floor(Math.random() * (C.UA.length - 1))]
}
