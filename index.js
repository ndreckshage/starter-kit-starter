const recursiveReaddir = require("recursive-readdir");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

const starterKitStarter = ({
  kitDirectory,
  outputDirectory,
  prompt = Promise.resolve({}),
  finalizeKit = identity => identity,
  dynamicExtension = ".kit"
}) => {
  prompt.then(answers => {
    recursiveReaddir(kitDirectory, (err, files) => {
      const fileMap = {};

      files.forEach(file => {
        const [, relativePath] = file.split(path.join(kitDirectory, path.sep));
        const adjustedRelativePath = relativePath.replace(dynamicExtension, "");
        if (fileMap[adjustedRelativePath]) {
          console.error(`Conflicting paths - ${adjustedRelativePath}`);
        }

        if (path.extname(file) === dynamicExtension) {
          fileMap[adjustedRelativePath] = require(file)(answers);
        } else {
          fileMap[adjustedRelativePath] = fs.readFileSync(file, "utf8");
        }
      });

      const finalFiles = finalizeKit(fileMap);
      Object.keys(finalFiles).forEach(adjustedRelativePath => {
        const finalPath = path.join(outputDirectory, adjustedRelativePath);
        mkdirp(path.dirname(finalPath), err => {
          if (err) {
            console.error(err);
          }

          fs.writeFile(finalPath, finalFiles[adjustedRelativePath], err => {
            if (err) console.error(err);
          });
        });
      });
    });
  });
};

module.exports = starterKitStarter;
