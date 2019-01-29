import CacheMock from '../lib';
import * as utils from '../lib/utils';
import 'isomorphic-fetch';

const responseBody = {
    success: true
};

jest.spyOn(utils, 'fitch').mockReturnValue(new Response(JSON.stringify(responseBody)));

describe('Cache Mock', (): void => {

    let cacheMock = new CacheMock();

    it('should add all of the requests to the cache', async (): Promise<void> => {
        const requests = ['1', new Request('2')];
        await cacheMock.addAll(requests);
        expect(cacheMock.cache.size).toBe(2);
    });

    it('should throw an invalid type error', async (): Promise<void> => {
        const functions = [cacheMock.add, utils.validateRequest, utils.getRequestUrl];
        for (const fn of functions) {
            try {
                await fn({} as RequestInfo);
            } catch (err) {
                expect(err).toBeInstanceOf(TypeError);
            }
        }
    });

    it('should return false if nothing was deleted', async (): Promise<void> => {
        const result = await cacheMock.delete(new Request('3'));
        expect(result).toBe(false);
    });

    it('should return true if the item was deleted', async (): Promise<void> => {
        await cacheMock.add('3');
        const result = await cacheMock.delete('3');
        expect(result).toBe(true);
    });

    it('should return all the keys in the cache', async (): Promise<void> => {
        const keys = await cacheMock.keys();
        expect(keys).toHaveLength(cacheMock.cache.size);
    });

    async function testKeys(request: RequestInfo, options?: CacheQueryOptions): Promise<void> {
        const keys = await cacheMock.keys(request, options);
        expect(keys).toHaveLength(1);
    }

    it('should return all the matching keys in the cache', async (): Promise<void> => {
        const firstRequest = '4',
            secondRequest = '5?foo="bar"';
        await cacheMock.add(firstRequest);
        await cacheMock.add(secondRequest);

        const ignoreSearchOpts = {
            ignoreSearch: true
        };

        const argPermutations: [RequestInfo, CacheQueryOptions | undefined][] = [
            [firstRequest, ignoreSearchOpts],
            [firstRequest, undefined],
            [secondRequest, ignoreSearchOpts]
        ];

        for (const args of argPermutations) {
            await testKeys(...args);
        }
    });

    it('should add a new item and overwrite an item', async (): Promise<void> => {
        const requestKey = 'first';

        const firstResponse = new Response(JSON.stringify(responseBody));

        await cacheMock.put(requestKey, firstResponse);
        expect(await cacheMock.match(requestKey)).toBe(firstResponse);

        const secondResponseBody = {
            success: false
        };
        const secondResponse = new Response(JSON.stringify(secondResponseBody));

        await cacheMock.put(requestKey, secondResponse);
        expect(await cacheMock.match(requestKey)).toBe(secondResponse);
    });

    it('should get all the matching items for a matching request', async (): Promise<void> => {
        const baseRequest = 'newRequest',
            baseRequestWithParams = baseRequest + '?foo=',
            firstRequest = baseRequestWithParams + 'bar',
            secondRequest = baseRequestWithParams + 'baz';

        await cacheMock.addAll([firstRequest, secondRequest]);

        const matches = await cacheMock.matchAll(baseRequestWithParams, { ignoreSearch: true });
        expect(matches).toHaveLength(2);
    });

    it('should return all the responses in the cache', async (): Promise<void> => {
        const matches = await cacheMock.matchAll();
        expect(matches).toHaveLength(cacheMock.cache.size);
    });

    it('should return a specific response', async (): Promise<void> => {

        const specificRequest = new Request('specificRequest?foo=bar');
        await cacheMock.add(specificRequest);

        expect(await cacheMock.matchAll(specificRequest)).toBeDefined();
    });

    it('should return undefined if nothing is found', async (): Promise<void> => {
        const match = await cacheMock.match(new Request('beer'));
        expect(match).toBeUndefined();
    });

});