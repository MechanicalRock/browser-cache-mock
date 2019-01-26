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
class CacheMock extends Cache {
    constructor() {
        super();
        this.cache = new Map();
    }
    async add(request) {
        if (utils.isRequest(request) || utils.isString(request)) {
            const response = await fetch(request);
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
        let requestUrl = utils.getRequestUrl(request);
        if (options.ignoreSearch) {
            requestUrl = utils.removeSearchParams(requestUrl);
        }
        const key = (await this.keys()).find(({ url }) => url === requestUrl);
        if (key) {
            return this.cache.delete(key);
        }
        return false;
    }
    keys(request, options) {
        let keys = Array.from(this.cache.keys());
        if (request && options && options.ignoreSearch) {
            let requestUrl = utils.getRequestUrl(request);
            requestUrl = utils.removeSearchParams(requestUrl);
            keys = keys.filter(({ url }) => url === requestUrl);
        }
        return Promise.resolve(keys);
    }
    match(request, options) {
        try {
            let req = utils.validateRequest(request);
            if (options && options.ignoreSearch) {
                req = new Request(utils.removeSearchParams(req.url));
            }
            return Promise.resolve(this.cache.get(req));
        }
        catch (error) {
            return Promise.reject();
        }
    }
    matchAll(request, options) {
        let matches = [];
        if (request) {
            const match = this.match(request, options);
            if (match) {
                matches.push(match);
            }
        }
        matches = Array.from(this.cache.values());
        return Promise.resolve(matches);
    }
    put(request, response) {
        const newRequest = utils.validateRequest(request);
        this.cache.set(newRequest, response);
        return Promise.resolve();
    }
}
exports.default = CacheMock;
