import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
  //fechando conexão com mongo pois usaremos mongo fake
  await server.close();
});

/* afterAll(async () => {
  await server.close();
}); */
