#!/bin/bash

compile () {
  asm2wasm $1.js | grep -v "(import \"env\"" > $1.wat
  wat2wasm -d $1.wat -o $1.wasm
}

compile "fib"
