import * as trpc from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';

export default function createRouter() {
	return trpc.router<Record<string, unknown>, OpenApiMeta>();
}
