const handel = require('./handle')
const path = require('path')
module.exports = async function(args) {
    args.componentName = args.componentName.toString()

    const componentName =
        args.componentName.substring(0, 1).toUpperCase() +
        args.componentName.substring(1) // this first toUpperCase
    let className = '' //change the capital letters but not first to '-Lowercase letters'
    const componentFileName = args.componentFileName

    for (let i = 0; i < args.componentName.length; i++) {
        if (/[A-Z]/.test(args.componentName[i]) && !!i) {
            className += '-'
        }
        className += args.componentName[i].toLowerCase()
    }
    if (args.path !== '') {
        args.path += '/'
    }
    const filePath = path.resolve(args.path) + '/' + componentName

    const createFileData = {
        filePath,
        componentName,
        componentFileName,
        className,
        templatePath: args.templatePath
    }
    // create floder
    await handel.createFolder(filePath)

    // create file
    await handel.createFile(createFileData)

    process.exit()
}
