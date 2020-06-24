const recursiveReaddir = require('recursive-readdir');
const path = require('path');
const fs = require('fs').promises;
const {readFileSync} = require('fs');

const starterKitStarter = ({
  kitDirectory,
  outputDirectory,
  prompt = Promise.resolve({}),
  finalizeKit = identity => identity,
  dynamicExtension = '.kit',
}) => {
  return prompt.then(answers => {
    return recursiveReaddir(kitDirectory).then(files => {
      const fileMap = {};

      files.forEach(file => {
        const [, relativePath] = file.split(path.join(kitDirectory, path.sep));
        const adjustedRelativePath = relativePath.replace(dynamicExtension, '');
        if (fileMap[adjustedRelativePath]) {
          console.error(`Conflicting paths - ${adjustedRelativePath}`);
        }

        if (path.extname(file) === dynamicExtension) {
          const fileOutput = require(file)(answers);
          if (fileOutput) {
            fileMap[adjustedRelativePath] = require(file)(answers);
          }
        } else {
          fileMap[adjustedRelativePath] = readFileSync(file, 'utf8');
        }
      });

      const finalFiles = finalizeKit(fileMap, answers);
      return Promise.all(
        Object.keys(finalFiles).map(adjustedRelativePath => {
          const finalPath = path.join(outputDirectory, adjustedRelativePath);
          return fs
            .mkdir(path.dirname(finalPath), {recursive: true})
            .then(() => {
              return fs.writeFile(finalPath, finalFiles[adjustedRelativePath]);
            })
            .catch(error => {
              console.error(error);
            });
        })
      );
    });
  });
};

module.exports = starterKitStarter;
