'use strict'

const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const { configSchema } = require('../config/default')
const { validate } = require('../misc/utils')
const UA = require('../misc/ua')

module.exports = function main(config) {
  let copiedConfig = _.cloneDeep(config)
  if (config.beforeRequest) {
    return config.beforeRequest()
      .then(res => {
        copiedConfig.requestOptions = _.merge(copiedConfig.requestOptions, res)
        return scrape(copiedConfig)
      })
      .catch(err => Promise.reject(err))
  } else {
    return scrape(copiedConfig)
  }
}

function scrape(config) {
  return new Promise((resolve, reject) => {
    validate(config, configSchema)
    if (config.printRequestUrl) console.log(`Requesting...${config.url}`)

    const handler = getRequestHandler(config, resolve)
    const request = getDefaultScraper(config)
    const options = Object.assign(config.requestOptions, { url: config.url })
    request(options, handler(config.prevRes))
  })
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

function getRequestHandler({ randomWait }, resolve) {
  return function(prevRes = {}) {
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
        }, _.random(randomWait * 1000))
      }
      setTimeout(function () {
        resolve(Object.assign(result, {
          html: body, createdAt: moment().toISOString()
        }))
      }, _.random(randomWait * 1000))
    }
  }
}
