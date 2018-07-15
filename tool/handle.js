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
     *  filePath component name
     *  componentName component`s name
     *  componentFileName component`s file name
     *  className
     *  templatePath template path
     * }
     */
    createFile: function({
        filePath,
        componentName,
        componentFileName,
        className,
        templatePath
    }) {
        const data = {
            componentName,
            componentFileName,
            filePath,
            className
        }
        data.templateFolderPath = path.join(templatePath)
        return new Promise(async (resolve, reject) => {
            await this.readAndWiteFile(data, resolve)
        })
    },
    /**
     * read template`s contents and write to you component’s file
     * @param args:{
     *  templateFolderPath
     *  componentName
     *  componentFileName
     *  filePath
     *  className
     * }
     * @param resolve
     */
    readAndWiteFile: function(
        {
            templateFolderPath,
            componentName,
            componentFileName,
            filePath,
            className
        },
        resolve
    ) {
        fs.readdir(templateFolderPath, 'utf8', (err, files) => {
            if (err) {
                console.log(colors.red(err))
                return false
            }
            files.forEach(templateName => {
                const newComponentName = templateName
                    .replace('TemplateName', componentFileName)
                    .replace('.txt', '')

                // 1.create folder
                fs.createWriteStream(`${filePath}/${newComponentName}`)
                // 2.rea & write template contents
                const content = fs
                    .readFileSync(`${templateFolderPath}/${templateName}`)
                    .toString() // read template`s contents
                    // replace template contens
                    .replace(/\${TemplateName}/g, componentName.split('.')[0])
                    .replace(/\${template-name}/g, className)
                // replace templateName to your component name
                fs.writeFileSync(
                    `${filePath}/${newComponentName}`,
                    content,
                    'utf8'
                )

                console.log(colors.green('write file: '))
                console.log(colors.underline(`${filePath}/${newComponentName}`))
            })

            resolve()
        })
    },
    /**
     * get folders
     * @param filePath
     * @param filterFolder  filter folder or files
     * @param folder boolean --default true
     */
    getFolderOrFiles: function(filePath, filterFolder, folder = true) {
        return new Promise(function(resolve, reject) {
            return fs.readdir(path.resolve(filePath), 'utf8', (err, files) => {
                if (!files) {
                    resolve([])
                    return false
                }
                filterFolder = filterFolder || []
                const filters = [].concat(filterFolder)
                const f = files.filter(v => {
                    if (folder) {
                        return !v.includes('.') && !filters.includes(v)
                    } else {
                        return v.includes('.') && !filters.includes(v)
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
