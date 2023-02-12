# z-version

> [Zguillez](https://zguillez.io) | Guillermo de la Iglesia

## Tools for package files

# Getting Started

## Install

```
npm i @zguillez/z-version --save-dev
yarn add @zguillez/z-version --dev
```

# Usage

```
const zversion = require('z-version');
```

# CLI Usage

```
"scripts": {
    "test": "zversion"
  }
```

## Update package version

```
zversion.update();
zversion.update('minor');
zversion.update('major');
```

```
zversion --update
zversion --update --minor
zversion --update --major
```

# Contributing and issues

Contributors are welcome, please fork and send pull requests! If you have any ideas on how to make this project better
then please submit an issue or send me an [email](mailto:guillermo@delaiglesia.email).

# License

©2023 Zguillez.IO

Original code licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License) Open Source projects used within this
project retain their original licenses.

# Changelog

### v12.0.0 (February 12, 2023)

* Update dependencies

### v0.1.0 (August 19, 2021)

* Initial commit
