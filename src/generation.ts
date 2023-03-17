import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const generate = (
  protoPath: string,
  outputPath: string,
  tsProtoOpt: string
) => {
  const generatedDir = path.join(process.cwd(), outputPath);
  const pathToProtoc = path.join(
    process.cwd(),
    "node_modules/grpc-tools/bin/protoc.js"
  );
  const pathToPlugin = path.join(
    process.cwd(),
    "node_modules/.bin/protoc-gen-ts_proto"
  );

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const generateCommand = (protoFile: string) =>
    `node ${pathToProtoc} --plugin=${pathToPlugin} --ts_proto_out=${outputPath} --proto_path=. ${protoFile} --ts_proto_opt=${tsProtoOpt}`;

  const generate = (startPath: string) => {
    if (!fs.existsSync(startPath)) {
      console.log("ERROR: FOLDER NOT FOUND", startPath);
      return;
    }

    const files = fs.readdirSync(startPath);

    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        if (!filename.includes("node_modules")) {
          generate(filename);
        }
      } else if (filename.endsWith(".proto")) {
        const fileName = `./${filename}`.split("\\").join("/");
        const dirName = path.dirname(fileName);

        const outputDir = path.join(generatedDir, dirName);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log("FILE GENERATION STARTED FOR:", filename);
        const command = generateCommand(fileName);

        console.log(command);
        execSync(command);
        console.log("COMPLETED\n");
      }
    }
  };

  generate(protoPath);
};
