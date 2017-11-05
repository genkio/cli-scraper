'use strict'

const request = require('request')
const _ = require('lodash')
const { requestConfig } = require('../config/default')
const C = require('../misc/constants')

module.exports = config => {
  return new Promise((resolve, reject) => {
    request.debug = config.debugRequest

    const requestOptions = getRequestOptions(config)
    const crawl = getDefaultCrawler(config)

    const callback = function(error, response, body) {
      const statusCode = _.get(response, 'statusCode', '')
      const url = _.get(this, 'href', '')
      const errMessage = _.get(error, 'message', '')

      if (error || (statusCode < 200 || statusCode >= 300)) {
        console.error(`${C.MESSAGES.ERROR.FAILED_TO_CRAWL}: (${statusCode}) ${url}`)
        resolve({ url, html: '', error: errMessage })
      }
      if (error) console.error(error.message)
      resolve({ url, html: body, error: errMessage })
    }

    crawl(requestOptions, callback)
  })
}

function getRequestOptions(config) {
  const { url, beforeRequest } = config
  const alteredConfig = beforeRequest(config)

  if (_.isEmpty(url) || !_.isString(url)) {
    throw TypeError(C.MESSAGES.ERROR.MISSING_URL)
  }
  if (_.isArray(alteredConfig) || !_.isObject(alteredConfig)) {
    throw TypeError(C.MESSAGES.ERROR.INVALID_CONFIG)
  }
  return _.merge({ url }, alteredConfig)
}

function getDefaultCrawler(config) {
  const { randomUserAgent } = config
  if (randomUserAgent) {
    requestConfig.headers['User-Agent'] = _.sample(C.UA)
  }

  return request.defaults(requestConfig)
}
