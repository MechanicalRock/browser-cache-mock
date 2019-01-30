[![Build Status](https://travis-ci.org/MechanicalRock/browser-cache-mock.svg?branch=master)](https://travis-ci.org/rickfoxcroft/browser-cache-mock)
[![npm version](https://badge.fury.io/js/browser-cache-mock.svg)](https://badge.fury.io/js/browser-cache-mock)
[![Coverage Status](https://coveralls.io/repos/github/MechanicalRock/browser-cache-mock/badge.svg?branch=master)](https://coveralls.io/github/MechanicalRock/browser-cache-mock?branch=master)

# Browser Cache Mock

A mock for the browser cache API that can be used in a node environment. Creating a new instance create an in-memory cache that can enable you to test your browser caching strategies effectively.
 * This module is Typescript ready.

## Installation

```
npm i -D browser-cache-mock
```

## Usage

### Add the following to your test code:

```javascript
import CacheMock from 'browser-cache-mock';

const cacheMock = new CacheMock();

window = {
    ...window,
    caches: {
        ...window.caches,
        open: async () => cacheMock,
        ...cacheMock
    }
};
```

## License

MIT

