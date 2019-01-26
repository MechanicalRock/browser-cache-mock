"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("./utils"));
class CacheMock {
    constructor() {
        this.cache = new Map();
    }
    get({ url }) {
        for (const [key, value] of this.cache.entries()) {
            if (key.url === url) {
                return value;
            }
        }
    }
    getAll({ url }) {
        let matches = [];
        for (const [key, value] of this.cache.entries()) {
            const regex = new RegExp(url, 'g');
            if (key.url.match(regex)) {
                matches.push(value);
            }
        }
        return matches;
    }
    set(request, response) {
        let relevantRequest = request;
        for (const [key] of this.cache.entries()) {
            if (key.url === request.url) {
                relevantRequest = key;
                break;
            }
        }
        this.cache = this.cache.set(relevantRequest, response);
    }
    async add(request) {
        if (utils.isRequest(request) || utils.isString(request)) {
            const response = await utils.fitch(request);
            this.cache.set(new Request(request), response);
        }
        else {
            throw utils.invalidRequestParamError();
        }
    }
    async addAll(requests) {
        for (const request of requests) {
            await this.add(request);
        }
    }
    async delete(request, options) {
        const requestUrl = this.getRequestUrl(request, options);
        const key = (await this.keys()).find(({ url }) => url === requestUrl);
        if (key) {
            return this.cache.delete(key);
        }
        return false;
    }
    getRequestUrl(request, options) {
        let requestUrl = utils.getRequestUrl(request);
        if (options && options.ignoreSearch) {
            requestUrl = utils.removeSearchParams(requestUrl);
        }
        return requestUrl;
    }
    async keys(request, options) {
        let keys = Array.from(this.cache.keys());
        if (request || (request && options && options.ignoreSearch)) {
            const requestUrl = this.getRequestUrl(request, options);
            const regex = new RegExp(requestUrl, 'g');
            return keys.filter(({ url }) => url.match(regex));
        }
        return keys;
    }
    async match(request, options) {
        const req = this.validateRequest(request, options);
        return this.get(req);
    }
    validateRequest(request, options) {
        let req = utils.validateRequest(request);
        if (options && options.ignoreSearch) {
            req = new Request(utils.removeSearchParams(req.url));
        }
        return req;
    }
    async matchAll(request, options) {
        if (request) {
            const req = this.validateRequest(request, options);
            return this.getAll(req);
        }
        else {
            return Array.from(this.cache.values());
        }
    }
    async put(request, response) {
        const newRequest = utils.validateRequest(request);
        this.set(newRequest, response);
    }
}
exports.default = CacheMock;
