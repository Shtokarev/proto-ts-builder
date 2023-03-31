import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const createReflection = (protoPath: string, skipFiles: string) => {
  const skipCommonFiles = skipFiles
    ? skipFiles.split(",").map((pathToFile) => pathToFile.trim())
    : [];

  const generatedDir = path.join(process.cwd());

  const pathToProtoc = require.resolve("grpc-tools/bin/protoc.js");
  const pathToPlugin = require.resolve("ts-proto/protoc-gen-ts_proto");

  const generateReflectFile = (protoFiles: string[]) =>
    `node ${pathToProtoc} --plugin=${pathToPlugin} --proto_path=. ${protoFiles.join(
      " "
    )} --descriptor_set_out=./protoset.bin --include_imports`;

  const gatherAllProtoFiles = (startPath: string, acc: string[] = []) => {
    if (!fs.existsSync(startPath)) {
      console.log("ERROR: FOLDER NOT FOUND", startPath);
      return [];
    }

    var files = fs.readdirSync(startPath);

    for (var i = 0; i < files.length; i++) {
      var filename = path.join(startPath, files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        if (!filename.includes("node_modules")) {
          gatherAllProtoFiles(filename, acc);
        }
      } else if (filename.endsWith(".proto")) {
        const fileName = `./${filename}`.split("\\").join("/");
        const dirName = path.dirname(fileName);

        const outputDir = path.join(generatedDir, dirName);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        if (!skipCommonFiles.includes(fileName)) {
          acc.push(fileName);
        }
      }
    }

    return acc;
  };

  const libPath = `./${protoPath}`;

  const fileNames = gatherAllProtoFiles(libPath);

  const generateReflectionCommand = generateReflectFile(fileNames);
  console.log(generateReflectionCommand, "\n");

  execSync(generateReflectionCommand);
};
