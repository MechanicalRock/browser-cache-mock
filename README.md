# Browser Cache Mock

A mock for the browser cache that can be used in a node environment.
This will enable you test your browser caching strategies effectively.
 * This module is Typescript ready.

## Getting Started

### Install Browser Cache Mock:

```
npm i -D browser-cache-mock --save-dev
```

### Add the following to your test code:

```javascript
import CacheMock from 'browser-cache-mock';

window.caches.open = (name?: string) => {
    return new CacheMock();
}
```

### Add the following to your Typescript type declarations (if necessary):

```typescript
interface Window {
    caches: {
        open(name?: string): CacheMock;
    }
}
```

