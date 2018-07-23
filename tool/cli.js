#!/usr/bin/env node
const path = require('path')
const handel = require('./handle')
const start = require('./start')
const inquirer = require('./inquirer')
;(async () => {
  const data = await inquirer()
  const args = {
    componentName: data.componentName,
    componentFileName: data.componentFileName,
    path: data.placementPath,
    templatePath: data.templatePath
  }
  start(args)
})()
