import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import Cache from './mocks/Cache';
import CacheStorage from './mocks/CacheStorage';
import Request from './mocks/Request';
import Response from './mocks/Response';

window.fetch = () => {};
window.Cache = Cache;
window.caches = new CacheStorage();
window.Request = Request;
window.Response = Response;
