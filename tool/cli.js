#!/usr/bin/env node
const path = require('path')
const create = require('./create')
const prompts = require('./prompts')
;(async () => {
  const data = await prompts()
  const args = {
    componentName: data.componentName,
    componentFilename: data.componentFilename,
    path: data.placementPath,
    templatePath: data.templatePath,
    templateIsFolder: data.componentFilename !== undefined
  }
  create(args)
})()
