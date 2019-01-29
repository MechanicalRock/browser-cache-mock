import * as utils from "./utils";

export default class CacheMock {
  cache: Map<Request, Response>;

  constructor() {
    this.cache = new Map();
  }

  private get({ url }: Request): Response | undefined {
    for (const [key, value] of this.cache.entries()) {
      if (key.url === url) {
        return value;
      }
    }
  }

  private getAll({ url }: Request): Response[] {
    let matches: Response[] = [];
    for (const [key, value] of this.cache.entries()) {
      const regex = new RegExp(url, 'g');
      if (key.url.match(regex)) {
        matches.push(value);
      }
    }
    return matches;
  }

  private set(request: Request, response: Response): void {
    let relevantRequest = request;

    for (const [key] of this.cache.entries()) {
      if (key.url === request.url) {
        relevantRequest = key;
        break;
      }
    }
    this.cache = this.cache.set(relevantRequest, response);
  }

  async add(request: RequestInfo): Promise<void> {

    if (utils.isRequest(request) || utils.isString(request)) {
      const response = await utils.fitch(request);
      this.cache.set(new Request(request), response);
    } else {
      throw utils.invalidRequestParamError();
    }
  }

  async addAll(requests: RequestInfo[]): Promise<void> {
    for (const request of requests) {
      await this.add(request);
    }
  }

  async delete(request: RequestInfo, options?: CacheQueryOptions): Promise<boolean> {
    const requestUrl = this.getRequestUrl(request, options);

    const key = (await this.keys()).find(({ url }) => url === requestUrl);

    if (key) {
      return this.cache.delete(key);
    }
    return false;
  }

  private getRequestUrl(request: RequestInfo, options?: CacheQueryOptions): string {
    let requestUrl = utils.getRequestUrl(request);

    if (options && options.ignoreSearch) {
      requestUrl = utils.removeSearchParams(requestUrl);
    }
    return requestUrl;
  }

  async keys(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>> {
    let keys = Array.from(this.cache.keys());

    if (request || (request && options && options.ignoreSearch)) {
      const requestUrl = this.getRequestUrl(request, options);
      const regex = new RegExp(requestUrl, 'g');
      return keys.filter(({ url }) => url.match(regex));
    }

    return keys;
  }

  async match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined> {
    const req = this.validateRequest(request, options);
    return this.get(req);
  }

  private validateRequest(request: RequestInfo, options?: CacheQueryOptions): Request {
    let req = utils.validateRequest(request);
    if (options && options.ignoreSearch) {
      req = new Request(utils.removeSearchParams(req.url));
    }
    return req;
  }

  async matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>> {
    if (request) {
      const req = this.validateRequest(request, options);
      return this.getAll(req);
    } else {
      return Array.from(this.cache.values());
    }
  }

  async put(request: RequestInfo, response: Response): Promise<void> {
    const newRequest = utils.validateRequest(request);
    this.set(newRequest, response);
  }
}
