'use strict'

const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const { configSchema } = require('../config/default')
const { validate } = require('../misc/utils')
const UA = require('../misc/ua')

module.exports = function scrape(config) {
  return new Promise((resolve, reject) => {
    const requestOptions = injectRequestOptions(config)
    validate(config, configSchema)

    const callback = function(prevRes = {}) {
      return function(err, response, body) {
        const statusCode = _.get(response, 'statusCode', '')
        const url = _.get(this, 'href', '')
        let error = ''
        let result = { url, prevRes, error, html: '' }

        if (err || (statusCode < 200 || statusCode >= 300)) {
          error = _.get(err, 'message', statusCode)
          setTimeout(function () {
            resolve(Object.assign(result, {
              error: error, html: '', createdAt: moment().toISOString()
            }))
          }, _.random(config.randomWait * 1000))
        }
        setTimeout(function () {
          resolve(Object.assign(result, {
            html: body, createdAt: moment().toISOString()
          }))
        }, _.random(config.randomWait * 1000))
      }
    }
    if (config.printRequestUrl) console.log(`Requesting...${config.url}`)
    getDefaultScraper(config)(requestOptions, callback(config.prevRes))
  })
}

function injectRequestOptions(config) {
  const { url, beforeRequest } = config
  const injectedRequestOptions = beforeRequest(config)
  return _.merge({ url }, injectedRequestOptions)
}

function getDefaultScraper(config) {
  const { randomUserAgent } = config
  const requestOptions = _.cloneDeep(config.requestOptions)
  request.debug = config.debugRequest
  if (randomUserAgent) {
    _.set(requestOptions, 'headers["User-Agent"]', _.sample(UA.BROWSER))
  }
  return request.defaults(requestOptions)
}
