# proto-ts-builder

## _Helper for Typescript gRPC proto API packages_

CLI utility for creating your own Typescript ESM/CJS API (DTO) package with client stubs, services generation and reflection file from a bunch of proto files, using ts-proto.
Just install the package in the repository with your proto files and run the command to generate the required typescript types and stubs.

## Features

- Processes all nested folders with proto files
- Generates types
- Generates services to use for gRPC @grpc/grpc-js servers
- Сreates index files for exporting types and services from subdirectories and the entire package
- Index files are generated for modules with type ESM or CJS
- Generates file for gRPC server reflection for all proto files

## Tech

Uses ts-proto (protoc) for generation, with widely used generation options, you can change them and set the necessary. Then package with the generated types and services can then be built using tsc and publish it.

## Commands

- generate-types [options]
- generate-services [options]
- index [options]
- help [command]

### generate-types

Usage:
proto-ts-builder generate-types [options]

| Options                               | Desc                                                                                                 | Default                                                                                                                                                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -p, --proto <proto_path>              | The source directory with the proto files and subfolders, relative to the current working directory. | .                                                                                                                                                                                                                                                                      |
| -d, --output <destination_path>       | The directory for TS generated types, relative to the current working directory.                     | ./generated/types                                                                                                                                                                                                                                                      |
| -o, --ts_proto_opt <ts-proto-options> | Options for protoc and ts-proto.                                                                     | outputEncodeMethods=false, outputJsonMethods=false, outputClientImpl=false, esModuleInterop=true, addGrpcMetadata=true, lowerCaseServiceMethods=true, unrecognizedEnum=true, exportCommonSymbols=true, oneof=unions, importSuffix=.js, env=node, removeEnumPrefix=true |
| -h, --help                            | display help for command                                                                             |                                                                                                                                                                                                                                                                        |

### generate-services

Usage:
proto-ts-builder generate-services [options]

| Options                               | Desc                                                                                                 | Default                                                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| -p, --proto <proto_path>              | The source directory with the proto files and subfolders, relative to the current working directory. | .                                                                                                                                                                                                                  |
| -d, --output <destination_path>       | The directory for TS generated files, relative to the current working directory.                     | ./generated                                                                                                                                                                                                        |
| -o, --ts_proto_opt <ts-proto-options> | Options for protoc and ts-proto.                                                                     | outputServices=grpc-js, addGrpcMetadata=true, esModuleInterop=true, lowerCaseServiceMethods=true, unrecognizedEnum=true, exportCommonSymbols=true, oneof=unions, importSuffix=.js, env=node, removeEnumPrefix=true |
| -h, --help                            | display help for command                                                                             |                                                                                                                                                                                                                    |

### index

Usage:
proto-ts-builder index [options]

| Options                       | Desc                                                                                     | Default                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| -d, --directory <name>        | The source directory with generated TS files, relative to the current working directory. | ./generated                                                    |
| -h, --header <comment_string> | String to prepend to top of generated file.                                              | // DO NOT EDIT - this file was generated by [proto-ts-builder] |
| -s --skip <path_name>         | Skip directory or file for indexing to prevent mixing types and services.                | types                                                          |
| -m --module <type>            | Type of library modules to be built (ESM or CJS)                                         | CJS                                                            |
| -p --pattern <sprintf_string> | Pattern for export command in the sprintf format                                         | export \* as %1$s from "%2$s";                                 |
| -h, --help                    | display help for command                                                                 |

### reflection

Usage:
proto-ts-builder reflection [options]

| Options                  | Desc                                                                                                                                                                        | Default |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| -p, --proto <proto_path> | The source directory with the proto files and subfolders, relative to the current working directory.                                                                        | .       |
| -s --skip <path_name>    | A list of proto files with relative paths, separated by commas, to be skipped in case of "TYPE is already defined in file FILE" protoc errors (circular dependencies issue) | empty   |
| -h, --help               | display help for command                                                                                                                                                    |

### Example

This is sample package.json for full packages (types ans services), ESM module:

```json
{
    "name": "grpc-client",
    "version": "0.0.1",
    "description": "gRPC client",
    "type": "module",
    "main": "./build/index.js",
    "exports": "./build/index.js",
    "scripts": {
        "clean": "rimraf ./build ./generated",
        "generate:types": "proto-ts-builder generate-types",
        "index:types": "proto-ts-builder index -m ESM -d ./generated/types",
        "generate:services": "proto-ts-builder generate-services",
        "index:services": "proto-ts-builder index -m ESM",
        "prebuild": "npm run clean && npm run generate:types && npm run index:types && npm run generate:services && npm run index:services",
        "build": "tsc",
        "reflection": "proto-ts-builder reflection"
    },
    "files": [
        "build/**"
    ],
    "license": "MIT",
    "dependencies": {},
    "devDependencies": {
        "proto-ts-builder": "^1.0.0",
        "rimraf": "^4.4.0",
        "typescript": "^4.9.5"
    }
```

## License

MIT
