import trpc from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';

export default function createRouter() {
	return trpc.router<{}, OpenApiMeta>();
}
