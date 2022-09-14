import { generateOpenApiDocument } from 'trpc-openapi';
import { router } from './routes';

/* 👇 */
export const openapi = generateOpenApiDocument(router, {
	title: 'tRPC OpenAPI',
	version: '1.0.0',
	baseUrl: 'http://localhost:3000',
});
