export default class CacheMock {
    cache: Map<Request, Response>;
    constructor();
    private get;
    private getAll;
    private set;
    add(request: RequestInfo): Promise<void>;
    addAll(requests: RequestInfo[]): Promise<void>;
    delete(request: RequestInfo, options?: CacheQueryOptions): Promise<boolean>;
    getRequestUrl(request: RequestInfo, options?: CacheQueryOptions): string;
    keys(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>>;
    match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined>;
    validateRequest(request: RequestInfo, options?: CacheQueryOptions): Request;
    matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>>;
    put(request: RequestInfo, response: Response): Promise<void>;
}
