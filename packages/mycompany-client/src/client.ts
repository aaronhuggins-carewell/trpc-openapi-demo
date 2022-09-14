import type { AppRouter } from 'mycompany-api-routes';
import { createTRPCClient, TRPCClient } from '@trpc/client'; /* 👈 */

export enum MycompanyApiURL {
	Local = 'http://localhost:3000/api/trpc',
	Stage = 'https://staging.blah.com/api/trpc',
	Production = 'https://blah.com/api/trpc',
}

export class MycompanyApiClient implements Omit<TRPCClient<AppRouter>, '$request'> {
	#client: TRPCClient<AppRouter>;

	constructor(url: MycompanyApiURL | `${'http' | 'https'}://${string}/trpc`) {
		this.#client = createTRPCClient({ url });
	}

	get runtime() {
		return this.#client.runtime;
	}

	get mutation() {
		return this.#client.mutation;
	}

	get query() {
		return this.#client.query;
	}

	get subscription() {
		return this.#client.subscription;
	}
}

export default MycompanyApiClient;
