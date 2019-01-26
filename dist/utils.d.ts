export declare function isRequest(request: RequestInfo): boolean;
export declare function isString(request: RequestInfo): boolean;
export declare function invalidRequestParamError(): TypeError;
export declare function getRequestUrl(request: RequestInfo): string;
export declare function validateRequest(request: RequestInfo): Request;
export declare function removeSearchParams(url: string): string;
export declare function fitch(input: RequestInfo, init?: RequestInit): Promise<Response>;
