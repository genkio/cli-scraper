'use strict'

const request = require('request')
const _ = require('lodash')
const { requestConfig } = require('../config/default')
const C = require('../misc/constants')

module.exports = config => {
  return new Promise((resolve, reject) => {
    request.debug = config.requestDebug

    const requestOptions = getRequestOptions(config)
    const crawl = getDefaultCrawler(config)

    crawl(requestOptions, (error, response, body) => {
      const statusCode = _.get(response, 'statusCode', '')
      const url = _.get(response, 'request.href', '')

      if (error || (statusCode >= 300)) {
        console.error(`${C.MESSAGES.ERROR.FAILED_TO_CRAWL}: (${statusCode}) ${url}`)
      }
      if (error) console.error(error.message)
      resolve({ url, html: (body || '') })
    })
  })
}

function getRequestOptions(config) {
  const { url, beforeRequest } = config
  if (_.isEmpty(url) || !_.isString(url)) {
    throw TypeError(C.MESSAGES.ERROR.MISSING_URL)
  }
  if (url.indexOf('http') < 0) {
    throw TypeError(C.MESSAGES.ERROR.MISSING_PROTOCOL)
  }
  if (_.isArray(beforeRequest()) || !_.isObject(beforeRequest())) {
    throw TypeError('')
  }
  return _.merge(beforeRequest(), { url })
}

function getDefaultCrawler(config) {
  const { randomUserAgent } = config
  if (randomUserAgent) {
    requestConfig.headers['User-Agent'] = _.sample(C.UA)
  }

  return request.defaults(requestConfig)
}
