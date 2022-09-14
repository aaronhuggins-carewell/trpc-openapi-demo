import createRouter from './createRouter';
import account from './account/index';
import sayHello from './sayHello/index';

export type AppRouter = typeof router;
export const router = createRouter().merge(account).merge(sayHello);
