/**
 * prompts
 * 1.input the component name which you want to add, to create a folder by this name
 * 2.input component‘s file’s name， default index
 * 3.choose your template
 * 4.choose your placement
 */

'use strict'
const inquirer = require('inquirer')
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))
const path = require('path')
const util = require('./util')
const colors = require('colors')
const fs = require('fs')
module.exports = async function run() {
  // Check that the templateconfig.json exists
  const templateconfig = await util.existFolderOrFile('templateconfig.json')
  if (!templateconfig) {
    console.log(`${colors.red('please Create the templateconfig.json file')}`)
    process.exit()
  }
  // Determines if the folder in the configuration file exists
  const { templatepath, componentPlacementPath } = JSON.parse(util.readConfig())
  const existTemplatepathFolder = await util.existFolderOrFile(
    `${templatepath}`
  )
  const existComponentPlacementPathFolder = await util.existFolderOrFile(
    `${componentPlacementPath}`
  )
  if (!existTemplatepathFolder || !existComponentPlacementPathFolder) {
    console.log(
      `${colors.red(
        'please Create the corresponding folder based on the templateconfig.json file'
      )}`
    )
    process.exit()
  }
  // 1.
  const inputComponentName = [
    {
      type: 'input',
      name: 'componentName',
      message: 'please input the component name',
      validate: function(input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async()

        // Do async stuff
        setTimeout(function() {
          if (input.replace(/(^\s*)|(\s*$)/g, '') === '') {
            // Pass the return value in the done callback
            done('componentName can not be null')
            return
          }
          // Pass the return value in the done callback
          done(null, true)
        }, 300)
      }
    }
  ]
  // 2.
  const inputComponentFileName = [
    {
      type: 'input',
      name: 'componentFilename',
      message: 'please input the component‘s file’s name',
      default: 'index',
      when: input => {
        // if componentName has ’.‘ ，it will be considered this is a document
        if (input.componentName.includes('.')) {
          return false
        } else {
          return true
        }
      }
    }
  ]
  // 3.template is Folde
  const templates = await util.getFolderOrFiles(templatepath, 'b')
  const templateFoldeChoice = templates.filter(v => {
    return !v.includes('.')
  })
  const selectTemplateFolder = [
    {
      type: 'list',
      name: 'template',
      message: 'please choose your template',
      choices: templateFoldeChoice,
      when: input => {
        const isFolder = !input.componentName.includes('.')
        if (!templateFoldeChoice.length && isFolder) {
          console.log(`${colors.red('please Create your templates')}`)
          process.exit()
        } else {
          return isFolder
        }
      }
    }
  ]
  // 3.template is file
  const templateFileChoice = templates.filter(v => {
    return v.includes('.')
  })
  const selectTemplateFile = [
    {
      type: 'list',
      name: 'template',
      message: 'please choose your template',
      choices: templateFileChoice,
      when: input => {
        const isFile = input.componentName.includes('.')
        if (!templateFileChoice.length && isFile) {
          console.log(`${colors.red('please Create your templates')}`)
          process.exit()
        } else {
          return isFile
        }
      }
    }
  ]
  // 4.
  const selectPlacementPath = [
    {
      type: 'fuzzypath',
      name: 'path',
      pathFilter: (isDirectory, nodePath) => isDirectory,
      // pathFilter :: (Bool, String) -> Bool
      // pathFilter allows to filter FS nodes by type and path
      rootPath: componentPlacementPath,
      // rootPath :: String
      // Root search directory
      message: 'please choose your placement',
      default: 'components',
      suggestOnly: false
      // suggestOnly :: Bool
      // Restrict prompt answer to available choices or use them as suggestions
    }
  ]
  // perform prompts
  const prompts = []
    .concat(inputComponentName)
    .concat(inputComponentFileName)
    .concat(selectTemplateFolder)
    .concat(selectTemplateFile)
    .concat(selectPlacementPath)
  return new Promise(async function(resolve, reject) {
    const answers = await inquirer.prompt(prompts)
    const existFileFolder = await util.existFolderOrFile(
      `${answers.path}/${answers.componentName}`
    )
    if (existFileFolder) {
      const { overridden } = await judgeOverridden()
      if (overridden) {
        deleteFolderOrFile(`${answers.path}/${answers.componentName}`)
        resolve({
          componentName: answers.componentName,
          componentFilename: answers.componentFilename,
          placementPath: answers.path,
          templatePath: `${templatepath}/${answers.template}` // TODO
        })
      } else {
        process.exit()
      }
    } else {
      resolve({
        componentName: answers.componentName,
        componentFilename: answers.componentFilename,
        placementPath: answers.path,
        templatePath: `${templatepath}/${answers.template}` // TODO
      })
    }
  })
}

function judgeOverridden() {
  return new Promise(async function(resolve, reject) {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'res',
        message: 'Folder or already exists, overridden?：y/n'
      }
    ])
    if (ans.res === 'y' || ans.res === '') {
      resolve({ overridden: true })
    } else {
      resolve({ overridden: false })
    }
  })
}

function deleteFolderOrFile(p) {
  var files = []
  if (fs.existsSync(p)) {
    const state = fs.statSync(path.resolve(p))
    if (state.isDirectory()) {
      files = fs.readdirSync(p)
      files.forEach(function(file, index) {
        var curPath = p + '/' + file
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          deleteFolderOrFile(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(p)
    } else {
      fs.unlinkSync(p)
    }
  }
}
