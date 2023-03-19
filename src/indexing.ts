import path from "path";
import fs from "fs";
import { sprintf } from "sprintf-js";

type ModuleType = "ESM" | "CJS";

const trimAndConvertToCamelCase = (name: string) =>
  name
    .replace(/\.[tj]s$/, "")
    .toLowerCase()
    .match(/[A-Z0-9]+/gi)
    ?.map((word, i) => (i ? word[0].toUpperCase() + word.slice(1) : word))
    .join("");

export const indexTsFolder = (
  sourceDirectory: string,
  indexHeader: string,
  skipDirName: string,
  module: ModuleType,
  pattern: string
) => {
  const isESMModule = module === "ESM";
  const fileExtReplacement = isESMModule ? ".js" : "";

  const replaceExt = (url: string) =>
    url.replace(/\.[tj]s$/, fileExtReplacement);

  const generateImportDirectory = (directory: string) =>
    isESMModule ? `./${directory}/index.js` : `./${directory}`;

  const createIndexFile = (importLines: string[]) =>
    indexHeader + "\n" + importLines.join("\n") + "\n";

  const proceedWithDirectoryFiles = (directoryPath: string) => {
    const files = fs.readdirSync(directoryPath);
    const importLines: string[] = [];

    files.forEach((fileOrDirectory) => {
      if (
        fs.lstatSync(path.join(directoryPath, fileOrDirectory)).isDirectory()
      ) {
        if (fileOrDirectory === skipDirName) {
          return;
        }

        const importDirCommand = sprintf(
          pattern,
          trimAndConvertToCamelCase(fileOrDirectory),
          generateImportDirectory(fileOrDirectory)
        );

        importLines.push(importDirCommand);

        proceedWithDirectoryFiles(path.join(directoryPath, fileOrDirectory));
      } else {
        if (fileOrDirectory === "index.ts") {
          return;
        }

        if (
          fileOrDirectory.endsWith(".ts") ||
          fileOrDirectory.indexOf(".") == -1
        ) {
          const importFileCommand = sprintf(
            pattern,
            trimAndConvertToCamelCase(fileOrDirectory),
            `./${replaceExt(fileOrDirectory)}`
          );

          importLines.push(importFileCommand);
        }
      }
    });

    const isIndexTsExists = fs.existsSync(path.join(directoryPath, "index.ts"));

    if (importLines.length && !isIndexTsExists) {
      fs.writeFileSync(
        path.join(directoryPath, "index.ts"),
        createIndexFile(importLines)
      );
    }
  };

  proceedWithDirectoryFiles(path.join(process.cwd(), sourceDirectory));
};
