'use strict'

const cheerio = require('cheerio')

module.exports = html => {
  return cheerio.load(html)
}
