# starter-kit-starter

Simple utility for creating flexible starter kits.

```javascript
declare function starterKitStarter({
  prompt: () => Promise<PromptResult>,
  kitDirectory: string, // some magic in here!
  finalizeKit: (FilepathsContentsMap, PromptResult) => FilepathsContentsMap,
  outputDirectory: string
}): void;
```

#### example!

`create-starter-kit-starter-example` uses `starter-kit-starter` to create files with. See [repo](repo), and experiment with:

```
yarn create starter-kit-starter-example my-app
```

## prompt

Bring your favorite prompt utility. [Enquirer](https://github.com/enquirer/enquirer), for example. Return a promise which resolves with your prompt answers.

```javascript
const { prompt } = require("enquirer");
const {
  _: [projectName]
} = require("minimist")(process.argv.slice(2));

module.exports = prompt([
  {
    type: "input",
    name: "projectName",
    message: "What is your project name?",
    default: projectName
  }
]);
```

## kitDirectory

Organize your starter kit code in a kit directory. If your file ends in a single extension, it will direct copy and paste. If your file ends in `.{extention}.js`, the file will be called as a function, with the result of your prompt, and you return a string. This allows for an organized, copy-paste like structure for some files, and allows you to build some files dynamically based on options (rather than using an invented template syntax).

```
my-project/
  ./a-1.js // direct copy paste
  ./a-2.js.js // called as a function
  ./b-1.php
  ./b-2.php.js
  ./c.css.js
  ./foo
    ./bar.js.js
    ./baz.js
  ./package.json.js
```

## finalize kit

Before we write files to disk, we call a finalize function with the full map of your kit files `{ './a-1.js': 'contents' }`, and prompt options.

This gives you a final chance to not add files / manipulate names based on prompt options. The map you return is written to disk.

## output directory

Where we write files to...
