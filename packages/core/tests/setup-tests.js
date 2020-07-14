import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

/**
 * TODO: test swr in chrome to avoid dangerous mocks
 */
// window.Cache = {};
// window.caches = {
//   store: {},

//   async open(name) {
//     const cachedCache = this.store[name];

//     if (cachedCache) {
//       return cachedCache;
//     }

//     const cache = {};

//     cache.match = (url) => {
//       const key = Object
//         .keys(cache)
//         .find(req => req.url === url);

//       return this.store[key];
//     };

//     cache.put = (req, res) => {
//       return this.store[req] = res;
//     };

//     return this.store[name] = cache;
//   },
// };
