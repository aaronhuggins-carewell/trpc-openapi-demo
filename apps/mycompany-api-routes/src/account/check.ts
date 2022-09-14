import createRouter from '../createRouter';
import { z } from 'zod';

export default createRouter().mutation('account/check/email', {
	input: z.object({
		id: z.string().email(),
	}),
	output: z.object({ ok: z.boolean() }),
	resolve: ({ input }) => {
		return { ok: true };
	},
	meta: { openapi: { enabled: true, method: 'POST', path: '/account/check/email' } },
});
