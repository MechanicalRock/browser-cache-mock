"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRequest(request) {
    return request instanceof Request;
}
exports.isRequest = isRequest;
function isString(request) {
    return typeof request === "string";
}
exports.isString = isString;
function invalidRequestParamError() {
    return new TypeError("request must be of type Request or string");
}
exports.invalidRequestParamError = invalidRequestParamError;
function getRequestUrl(request) {
    if (request instanceof Request) {
        return request.url;
    }
    else if (isString(request)) {
        return request;
    }
    throw invalidRequestParamError();
}
exports.getRequestUrl = getRequestUrl;
function validateRequest(request) {
    if (request instanceof Request) {
        return request;
    }
    else if (isString(request)) {
        return new Request(request);
    }
    throw invalidRequestParamError();
}
exports.validateRequest = validateRequest;
function removeSearchParams(url) {
    return url.split("?")[0];
}
exports.removeSearchParams = removeSearchParams;
