import createRouter from '../createRouter';
import { z } from 'zod';

export default createRouter().query('sayHello', {
	input: z.object({ name: z.string() }),
	output: z.object({ greeting: z.string() }),
	resolve: ({ input }) => {
		return { greeting: `Hello ${input.name}!` };
	},
	meta: { openapi: { enabled: true, method: 'GET', path: '/sayHello/{name}' } },
});
