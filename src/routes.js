import { Router } from 'express';

import SessionController from './controllers/SessionController';

const routes = new Router();

routes.post('/login', SessionController.login);
routes.post('/user', SessionController.createUser);
routes.get('/usuarios', SessionController.index);
routes.post('/usuarios/search', SessionController.search);

export default routes;