# Browser Cache Mock

[![CircleCI](https://circleci.com/gh/MechanicalRock/browser-cache-mock/tree/master.svg?style=svg)](https://circleci.com/gh/MechanicalRock/browser-cache-mock/tree/master)
[![npm version](https://badge.fury.io/js/browser-cache-mock.svg)](https://badge.fury.io/js/browser-cache-mock)
[![Coverage Status](https://coveralls.io/repos/github/MechanicalRock/browser-cache-mock/badge.svg?branch=master)](https://coveralls.io/github/MechanicalRock/browser-cache-mock?branch=master)

A mock for the browser cache API that can be used in a node environment. Creating a new instance creates an in-memory cache that can enable you to test your browser caching strategies effectively.

* This module is Typescript ready.

## Installation

```bash
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
