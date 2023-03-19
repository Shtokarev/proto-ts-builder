#!/usr/bin/env node
import { Command, Option } from "commander";
import { generate } from "./generation";
import { indexTsFolder } from "./indexing";

const program = new Command();

program
  .name("proto-ts-builder")
  .description(
    "CLI utility for creating Typescript ESM package with client and service from a bunch of proto files, using ts-proto"
  )
  .version("0.0.1");

program
  .command("generate-types")
  .option(
    "-p, --proto <proto_path>",
    "The source directory with the proto files and subfolders, relative to the current working directory.",
    "."
  )
  .option(
    "-d, --output <destination_path>",
    "The directory for TS generated types, relative to the current working directory.",
    "./generated/types"
  )
  .option(
    "-o,  --ts_proto_opt <ts-proto-options>",
    "Options for ts-proto.",
    "outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false,esModuleInterop=true,addGrpcMetadata=true,lowerCaseServiceMethods=true,unrecognizedEnum=true,exportCommonSymbols=true,oneof=unions,importSuffix=.js,env=node,removeEnumPrefix=true"
  )
  .action((options) => {
    const { proto, output, ts_proto_opt } = options;
    console.log("STARTING GENERATE TS TYPE FILES\n");

    generate(proto, output, ts_proto_opt);
    console.log("TYPE FILES GENERATION COMPLETED\n");
  });

program
  .command("generate-services")
  .option(
    "-p, --proto <proto_path>",
    "The source directory with the proto files and subfolders, relative to the current working directory.",
    "."
  )
  .option(
    "-d, --output <destination_path>",
    "The directory for TS generated files, relative to the current working directory.",
    "./generated"
  )
  .option(
    "-o,  --ts_proto_opt <ts-proto-options>",
    "Options for ts-proto.",
    "outputServices=grpc-js,addGrpcMetadata=true,esModuleInterop=true,lowerCaseServiceMethods=true,unrecognizedEnum=true,exportCommonSymbols=true,oneof=unions,importSuffix=.js,env=node,removeEnumPrefix=true"
  )

  .action((options) => {
    const { proto, output, ts_proto_opt } = options;
    console.log("STARTING GENERATE TS SERVICES FILES\n");

    generate(proto, output, ts_proto_opt);
    console.log("SERVICES FILES GENERATION COMPLETED\n");
  });

program
  .command("index")
  .option(
    "-d, --directory <name>",
    "The source directory with generated TS files, relative to the current working directory.",
    "./generated"
  )
  .option(
    "-h, --header <comment_string>",
    "String to prepend to top of generated file.",
    "// DO NOT EDIT - this file was generated by [proto-ts-builder]\n"
  )
  .option(
    "-s --skip <path_name>",
    "Skip directory or file for indexing to prevent mixing types and services.",
    "types"
  )
  .addOption(
    new Option(
      "-m --module <type>",
      "Type of library modules to be built (ESM or CJS)"
    )
      .choices(["ESM", "CJS"])
      .default("CJS")
  )
  .option(
    "-p --pattern <sprintf_string>",
    "pattern for export command in the sprintf format",
    'export * as %1$s from "%2$s";'
  )
  .action((options) => {
    const { directory, header, skip, module, pattern } = options;
    console.log("STARTING INDEXING TS FILES\n");

    indexTsFolder(directory, header, skip, module, pattern);
    console.log("INDEXING COMPLETED\n");
  });

program.parse();
