'use strict'

const request = require('request')
const _ = require('lodash')
const { requestBaseConfig, configSchema } = require('../config/default')
const { validate } = require('../misc/utils')
const C = require('../misc/constants')

module.exports = config => {
  return new Promise((resolve, reject) => {
    const requestOptions = injectRequestOptions(config)
    validate(config, configSchema)

    const callback = function(prevRes) {
      return function(error, response, body) {
        const statusCode = _.get(response, 'statusCode', '')
        const url = _.get(this, 'href', '')
        const errMessage = _.get(error, 'message', '')

        if (error || (statusCode < 200 || statusCode >= 300)) {
          console.error(`${C.MESSAGES.ERROR.FAILED_TO_CRAWL}: (${statusCode}) ${url}`)
          resolve({ url, html: '', error: errMessage })
        }
        if (error) console.error(error.message)
        resolve({ url, html: body, error: errMessage, prevRes: prevRes || '' })
      }
    }

    getDefaultCrawler(config)(requestOptions, callback(config.prevRes))
  })
}

function injectRequestOptions(config) {
  const { url, beforeRequest } = config
  const injectedRequestOptions = beforeRequest(config)
  return _.merge({ url }, injectedRequestOptions)
}

function getDefaultCrawler(config) {
  const { randomUserAgent } = config
  request.debug = config.debugRequest
  if (randomUserAgent) {
    requestBaseConfig.headers['User-Agent'] = _.sample(C.UA)
  }
  return request.defaults(requestBaseConfig)
}
