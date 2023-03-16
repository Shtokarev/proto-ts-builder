#!/usr/bin/env bash

chmod 0755 dist/cjs/src/bin.js

cat >dist/cjs/package.json <<!EOF
{
  "type": "commonjs"
}
!EOF

cat >dist/mjs/package.json <<!EOF
{
  "type": "module"
}
!EOF
