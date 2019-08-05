# starter-kit-starter

Simple utility for creating flexible starter kits.

```javascript
declare function starterKitStarter({
  outputDirectory: string,
  kitDirectory: string, // some magic in here!
  prompt: Promise<PromptResult>,
  finalizeKit: (FilepathsContentsMap, PromptResult) => FilepathsContentsMap
}): void;
```

#### example!

`create-starter-kit-starter-example` uses `starter-kit-starter` to create files with. See [example repo](https://github.com/ndreckshage/starter-kit-starter), and experiment with:

```
yarn create starter-kit-starter-example my-app
```

## usage

```javascript
#!/usr/bin/env node

const starterKitStarter = require("starter-kit-starter");
const { prompt } = require("enquirer");
const path = require("path");

const {
  _: [outputDirectory]
} = require("minimist")(process.argv.slice(2));

starterKitStarter({
  prompt: prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is the project name?",
      default: outputDirectory
    }
  ]),
  finalizeKit: (kit, answers) => kit,
  kitDirectory: path.resolve(__dirname, "kit"),
  outputDirectory: path.resolve(process.cwd(), outputDirectory),
  dynamicExtension: ".kit"
});
```

## kitDirectory / dynamicExtension

Organize your starter kit code in a kit directory. If your file ends in a single extension, it will direct copy and paste. If your file ends in `.extension.dynamicExtension` (`.js.kit`), the file will be called as a function, with the result of your prompt, and you return a string. This allows for an organized, copy-paste like structure for some files, and allows you to build some files dynamically based on options (rather than using an invented template syntax).

```
my-project/
  ./a-1.js // direct copy paste
  ./a-2.js.kit // called as a function
  ./b-1.php
  ./b-2.php.kit
  ./c.css.kit
  ./foo
    ./bar.js.kit
    ./baz.js
  ./package.json.kit
```

## finalize kit

Before we write files to disk, we call a finalize function with the full map of your kit files `{ './a-1.js': 'contents' }`, and prompt options.

This gives you a final chance to not add files / manipulate names based on prompt options. The map you return is written to disk.
