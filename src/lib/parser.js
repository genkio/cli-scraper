'use strict'

const _ = require('lodash')
const cheerio = require('cheerio')

module.exports = res => {
  return _.merge(res, { $: cheerio.load(res.html) })
}
