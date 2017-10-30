'use strict'

const crawler = require('./lib/crawler')
const parser = require('./lib/parser')
const descriptor = require('../tests/bing')

crawler({url: descriptor.url})
  .then(res => parser(res))
  .then($ => descriptor.handler($))
  .then(res => console.log(res))
  .catch(e => console.log(e))
