'use strict'

const request = require('request')

module.exports = descriptor => {
  const url = descriptor.url
  return new Promise((resolve, reject) => {
    const options = {
      url: url.indexOf('http') < 0 ? `http://${url}` : url,
      encoding: 'utf8',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
      },
      timeout: 1000 * 60,
      gzip: true
    }
    request(options, (error, response, body) => {
      if (error) { reject(error) }
      if (response.statusCode !== 200) { reject(response.statusCode) }
      resolve(body)
    })
  })
}
