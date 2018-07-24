const util = require('./util')
const path = require('path')
const fs = require('fs')
module.exports = async function(args) {
  const componentName = args.componentName.toString().replace(/\s/gi, '')
  const componentPath = path.resolve(args.path) + '/' + componentName
  if (args.templateIsFolder) {
    const componentFilename = args.componentFilename

    const createFileData = {
      componentPath,
      componentName,
      componentFilename,
      templatePath: args.templatePath
    }

    // create floder
    await util.createFolder(componentPath)

    // create file
    await util.createFile(createFileData)
  } else {
    await util.createTemplateFile({
      componentName: componentName.split('.')[0],
      templatePath: args.templatePath,
      componentPath
    })
  }
  process.exit()
}
