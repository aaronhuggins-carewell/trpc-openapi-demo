import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import morgan from 'morgan';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';

import { router } from 'mycompany-api-routes';
import { openapi } from 'mycompany-api-routes/dist/openapi'; /* 👈 */

const app = express();
function createContext() {
	return {};
}

app.use(morgan('combined'));
// Makes a tRPC endpoint available for using tRPC clients
app.use('/api/trpc', createExpressMiddleware({ router, createContext }));
// Makes a REST endpoint available for use with OpenAPI
app.use('/api', createOpenApiExpressMiddleware({ router, createContext }));
// Makes the generated OpenAPI doc available with the existing code.
app.get('/openapi.json' /* 👈 */, (_req, res) => {
	res.json(openapi); /* 👈 */
});

app.listen(3000);
