import path from "path";
import fs from "fs";

export const indexTsFolder = (
  sourceDirectory: string,
  indexHeader: string,
  skipDirName: string
) => {
  const replaceExt = (url: string, replacer = "") =>
    url.replace(/\.ts$/, replacer);

  const createIndexFile = (importLines: string[]) =>
    indexHeader +
    "\n" +
    importLines.map((file) => `export * from "${file}";`).join("\n") +
    "\n";

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

        importLines.push(`./${fileOrDirectory}/index.js`);
        proceedWithDirectoryFiles(path.join(directoryPath, fileOrDirectory));
      } else {
        if (
          fileOrDirectory.endsWith(".ts") ||
          fileOrDirectory.indexOf(".") == -1
        ) {
          importLines.push(`./${replaceExt(fileOrDirectory)}.js`);
        }
      }
    });

    const isIndexTsExists = fs.existsSync(path.join(directoryPath, "index.ts"));

    if (importLines.length && !isIndexTsExists) {
      fs.writeFileSync(
        path.join(directoryPath, "index.ts"),
        createIndexFile(importLines)
      );
      console.log(createIndexFile(importLines));
    }
  };

  proceedWithDirectoryFiles(path.join(process.cwd(), sourceDirectory));
};
