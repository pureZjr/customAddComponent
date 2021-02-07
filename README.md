# customaddcomponents

_Easy, create your custom component._

---

## Introduction

_Any components that can be created from the custom template, should be. Automatically._

customaddcomponents is a tool that help you to created components not restricted to React、Vue，it is base on the template
that you make it.

## Installation

You can install it using yarn or npm, whatever you prefer.

```
yarn add customaddcomponents
npm install customaddcomponents
```

## Scene

I want to create a React component call **Avatar**

- Firstly - create folder and files

  1. create folder **Avatar**
  2. create **index.tsx**、**index.scss**

- Secondly - write common code

  ```js
    // index.tsx
    import * as React from 'react'

    import styles from './index.scss'

    interface Props{}

    function Avatar: React.FC = ({}:Pops) => {
        return <div className={styles.container}>Avatar</div>
    }
    export default Avatar
  ```

  ```css
  // index.scss
  @import "base.scss";

  .container {
    background: #fff;
  }
  ```

So let's now summarize the example. two things, **create folder、files and
write common code.**

## Show

This util can help you to do this thing more easily. **For Example**

![此处输入图片的描述][1]
[1]: https://note.ss.purevivi.chat/5e50d0d451de70ec0445b6539a27a874.gif

## Setting

- Firstly - create **templateconfig.json** in the root dir

```json
// templateconfig.json

{
  "templatepath": "./src/utils/CustomTemplate",
  "componentPlacementPath": "src"
}
```

- Secondly - create template file base on **templatepath**

```js
// ./src/utils/CustomTemplate/FunctionComponent/TemplateName.scss.txt

@import 'base.scss';

.container{
    background:#fff;
}

```

```js
// ./src/utils/CustomTemplate/FunctionComponent/TemplateName.tsx.txt

import * as React from 'react'

import styles from './index.scss'

interface Props {}

const ${ComponentName}: React.FC = (props: Props) => {
    return <div className={styles.container}>${ComponentName}</div>
}

export default ${ComponentName}

```

- Lastly - add script

```js
// package.json

 "scripts": {
    ...
    "add": "add-component",
    ...
 }

```

## PS

- you can write this var in the template

```
${component-name} -> component-name
${componentName}  -> componentName
${ComponentName}  -> ComponentName
${component-filename} -> component-filename
${componentFilename}  -> componentFilename
${ComponentFilename}  -> ComponentFilename

```
