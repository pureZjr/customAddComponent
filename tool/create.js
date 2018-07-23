const util = require('./util')
const path = require('path')
module.exports = async function(args) {
  const componentName = args.componentName.toString().replace(/\s/gi, '')
  const componentPath = path.resolve(args.path) + '/' + componentName
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

  process.exit()
}
