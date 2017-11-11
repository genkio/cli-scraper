#!/usr/bin/env node
'use strict'

const program = require('commander')
const fs = require('fs')
const pathLib = require('path')

const { stringify } = require('../misc/utils')
const { defaultConfig } = require('../config/default')
const handle = require('../core')

program
  .command('init [path]')
  .alias('i')
  .description('initialize a new configuration file')
  .action(function(path) {
    path = path || './config.js'
    fs.writeFileSync(path, stringify(defaultConfig), 'utf-8', err => {
      if (err) throw err
    })
  })

program
  .command('process [path]')
  .alias('p')
  .description('process a configuration')
  .action(function(path) {
    const defaultPath = './config.js'
    path = pathLib.resolve(process.cwd(), path || defaultPath)
    const config = require(path)
    handle(config).catch(e => console.log(e))
  })

program.parse(process.argv)
