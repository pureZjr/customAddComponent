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
      default: 'index'
    }
  ]
  // 3.
  const template = await util.getFolderOrFiles(templatepath)
  const templateChoice = [].concat(template)
  if (!templateChoice.length) {
    console.log(`${colors.red('please Create your templates')}`)
    process.exit()
  }
  const selectTemplate = [
    {
      type: 'list',
      name: 'template',
      message: 'please choose your template',
      choices: templateChoice
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
    .concat(selectTemplate)
    .concat(selectPlacementPath)
  return new Promise(async function(resolve, reject) {
    const answers = await inquirer.prompt(prompts)
    const existFileFolder = await util.existFolderOrFile(
      `${answers.path}/${answers.componentName}`
    )
    if (existFileFolder) {
      const { overridden } = await judgeOverridden()
      if (overridden) {
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
        message: 'Folder already exists, overridden?：y/n'
      }
    ])
    if (ans.res === 'y' || ans.res === '') {
      resolve({ overridden: true })
    } else {
      resolve({ overridden: false })
    }
  })
}
