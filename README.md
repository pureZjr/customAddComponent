<div style="margin: 20px 0;font-size:29px;">customaddcomponents</div>

<div style="background:#fff;border-radius:5px;width:73px;overflow:hidden;height:20px;font-size:10px;line-height:20px;">
    <div style="display:inline-block;background:#5d5d5d;color:#fff;float:left;padding:0 5px;">node</div>
    <div style="display:inline-block;background:#4ac41e;padding:0 5px;color:#fff;">>7.6</div>
</div>

A tool to create components based on custom templates.

## [npm address](https://www.npmjs.com/package/customaddcomponents)

## [Documentation](#documentation)

<a name="documentation"></a>

### Installation

<a name="installation"></a>

```shell
npm install customaddcomponents
```

#### add script in your package.json

```json
"scripts": {

    "add": "add-component",
},
```

#### create a templateconfig.json & write

```json
{ "templatepath": "CustomTemplate", "componentPlacementPath": "src" }
```

- **templatepath**: the placement of your template
- **CustomAddcCmponents**: The root directory which you want to place your component
  <a name="examples"></a>

#### create two folders name `src` and `CustomTemplate`

#### create templates into the CustomTemplate folder like

![image](https://wx-static.yidejia.com/gDAcwF4KcWJfvH8WszFbzGz7spJPmz1yQnliJizE:foowUQgADv1gm7X3jtA3SPRONVE=:eyJzY29wZSI6Ind4LW1hcmtldGluZy1tYW5hZ2VyIiwiZGVhZGxpbmUiOjE1MzEzNjM5MTh9.png)

### Examples (Run it and see it)

```shell
npm run add
```

![image](https://wx-static.yidejia.com/gDAcwF4KcWJfvH8WszFbzGz7spJPmz1yQnliJizE:Vzvc_ttpApBxmDlg5qZWpqh-ICY=:eyJzY29wZSI6Ind4LW1hcmtldGluZy1tYW5hZ2VyIiwiZGVhZGxpbmUiOjE1MzEzNjQ4MzV9.png)

### About the to write your template

```
${component-name} -> component-name
${componentName}  -> componentName
${ComponentName}  -> ComponentName
${component-filename} -> component-filename
${componentFilename}  -> componentFilename
${ComponentFilename}  -> ComponentFilename
```

### example

`template.tsx.txt`

```
import { Component } from 'react'

export default class ${TemplateName} extends Components {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return <div className='${template-name}'>${TemplateName}</div>
  }
}
```

`your component file`

```
import { Component } from 'react'

export default class YourComponent extends Components {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return <div className='your-component'>YourComponent</div>
  }
}
```
