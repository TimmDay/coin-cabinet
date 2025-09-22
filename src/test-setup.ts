import '@testing-library/jest-dom'

// Polyfills for Node.js 18 compatibility with happy-dom
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof globalThis.structuredClone === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}

// Mock fetch if not available
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = async () => new Response()
}

// Basic URL polyfill for Node.js 18
if (typeof globalThis.URL === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.URL = class URL {
    constructor(public href: string) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    }
    toString() { return this.href }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

if (typeof globalThis.URLSearchParams === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.URLSearchParams = class URLSearchParams {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
    get() { return null }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    append() {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
};
