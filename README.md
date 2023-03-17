# proto-ts-builder

## _Helper for Typescript gRPC proto API packages_

CLI utility for creating Typescript ESM/CJS package with client stubs and services generation from a bunch of proto files, using ts-proto.
Just install the package in the repository with your proto files and run the command to generate the required typescript types and stubs.

## Features

- Processes all nested folders with proto files
- Generates types
- Generates services to use for gRPC @grpc/grpc-js servers
- Сreates index files for exporting types and services from subdirectories and the entire package

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

| Options                     | Desc                                                                                     | Default                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| -d, --directory <directory> | The source directory with generated TS files, relative to the current working directory. | ./generated                                                    |
| -h, --header <header>       | String to prepend to top of generated file.                                              | // DO NOT EDIT - this file was generated by [proto-ts-builder] |
| -s --skip <name>            | Skip directory or file for indexing to prevent mixing types and services.                | types                                                          |
| -h, --help                  | display help for command                                                                 |

### Example

This is sample package.json for full packages (types ans services):

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
        "prebuild": "proto-ts-builder generate-types && proto-ts-builder index --directory ./generated/types && proto-ts-builder generate-services && proto-ts-builder index",
        "build": "tsc"
    },
    "files": [
        "build/**"
    ],
    "license": "MIT",
    "dependencies": {},
    "devDependencies": {
        "rimraf": "^4.4.0",
        "typescript": "^4.9.5"
    }
```

you can use ESM or CJS, whatever you need.

## License

MIT
