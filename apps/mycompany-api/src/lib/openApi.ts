import { generateOpenApiDocument } from 'trpc-openapi';
import { router } from 'mycompany-api-routes';

/* 👇 */
export const openApiDocument = generateOpenApiDocument(router, {
	title: 'tRPC OpenAPI',
	version: '1.0.0',
	baseUrl: 'http://localhost:3000',
});
