const fs = require('fs')
const colors = require('colors')
const path = require('path')
module.exports = {
  existFolderOrFile: async function(path) {
    return new Promise(function(resolve, reject) {
      return fs.exists(path, e => {
        resolve(e)
      })
    })
  },
  /**
   *create folder
   @param filePath
   */
  createFolder: function(filePath) {
    return new Promise(function(resolve, reject) {
      fs.mkdir(filePath, function(err) {
        if (err) {
          if (err.errno === -2) {
            console.log(colors.red('can not find folder'))
          } else if (err.errno === -17) {
          }
        } else {
          console.log(colors.green('create folder: '))
          console.log(colors.underline(`${filePath}`))
        }
        resolve()
      })
    })
  },
  /**
   * @param args:{
   *  componentPath component`s path
   *  componentName component`s name
   *  componentFilename component`s file name
   *  templatePath template`s path
   * }
   */
  createFile: function({
    componentPath,
    componentName,
    componentFilename,
    templatePath
  }) {
    const data = {
      componentPath,
      componentName,
      componentFilename,
      templateFolderPath: path.join(templatePath)
    }
    return new Promise(async (resolve, reject) => {
      await readAndWiteFile(data, resolve)
    })
  },
  /**
   * get folders
   * @param filePath
   * @param folder boolean --default true
   */
  getFolderOrFiles: function(filePath, folder = true) {
    return new Promise(function(resolve, reject) {
      return fs.readdir(path.resolve(filePath), 'utf8', (err, files) => {
        if (!files) {
          resolve([])
          return false
        }
        const f = files.filter(v => {
          const state = fs.statSync(path.resolve(`${filePath}/${v}`))
          if (folder) {
            return state.isDirectory()
          } else {
            return !state.isDirectory()
          }
        })
        resolve(f)
      })
    })
  },
  readConfig: function() {
    return fs
      .readFileSync(`${path.resolve('.')}/templateconfig.json`)
      .toString()
  }
}

/**
 * read template`s contents and write to you component’s file
 * @param args:{
 *  componentPath
 *  componentName
 *  componentFilename
 *  templateFolderPath
 * }
 * @param resolve
 */
function readAndWiteFile(
  { componentPath, componentName, componentFilename, templateFolderPath },
  resolve
) {
  fs.readdir(templateFolderPath, 'utf8', (err, files) => {
    if (err) {
      console.log(colors.red(err))
      return false
    }
    files.forEach(templateName => {
      const newComponentName = templateName
        .replace('TemplateName', componentFilename)
        .replace('.txt', '')

      // translation
      // ${ComponentName} -> ComponentName
      const ComponentName =
        componentName.substring(0, 1).toUpperCase() + componentName.substring(1)
      // ${component-name} -> component-name
      let className1 = ''
      for (let i = 0; i < componentName.length; i++) {
        if (/[A-Z]/.test(componentName[i]) && !!i) {
          className1 += '-'
        }
        className1 += componentName[i].toLowerCase()
      }
      // ${ComponentFilename} -> ComponentFilename
      const ComponentFilename =
        componentFilename.substring(0, 1).toUpperCase() +
        componentFilename.substring(1)
      // ${component-filename} -> component-filename
      let className2 = ''
      for (let i = 0; i < componentFilename.length; i++) {
        if (/[A-Z]/.test(componentFilename[i]) && !!i) {
          className2 += '-'
        }
        className2 += componentFilename[i].toLowerCase()
      }
      // 1.create file
      //fs.createWriteStream(`${componentPath}/${newComponentName}`)
      // 2.read & write template contents
      const content = fs
        .readFileSync(`${templateFolderPath}/${templateName}`)
        .toString()
        .replace(/\${ComponentName}/g, ComponentName)
        .replace(/\${componentName}/g, componentName)
        .replace(/\${component-name}/g, className1)
        .replace(/\${ComponentFilename}/g, ComponentFilename)
        .replace(/\${componentFilename}/g, componentFilename)
        .replace(/\${component-filename}/g, className2)
      fs.writeFileSync(`${componentPath}/${newComponentName}`, content, 'utf8')

      console.log(colors.green('write file: '))
      console.log(colors.underline(`${componentPath}/${newComponentName}`))
    })

    resolve()
  })
}
