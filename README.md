# z-version

[![npm version](https://badge.fury.io/js/z-version.svg)](https://badge.fury.io/js/z-version)
[![Build Status](https://travis-ci.org/zguillez/z-version.svg?branch=master)](https://travis-ci.org/zguillez/z-version)
[![Installs](https://img.shields.io/npm/dt/z-version.svg)](https://coveralls.io/r/zguillez/z-version)
[![Gitter](https://badges.gitter.im/zguillez/z-version.svg)](https://gitter.im/zguillez/z-version?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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

Contributors are welcome, please fork and send pull requests! If you have any ideas on how to make this project better then please submit an issue or send me an [email](mailto:mail@zguillez.io).

# License

©2021 Zguillez.io

Original code licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License) Open Source projects used within this project retain their original licenses.

# Changelog

### v0.1.0 (August 19, 2021)

* Initial commit
