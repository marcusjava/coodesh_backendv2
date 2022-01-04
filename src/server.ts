import './util/module-alias';
import { Server } from '@overnightjs/core';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as database from '@src/database';
import { ArticlesController } from '@src/controllers/articles';
import { UsersController } from '@src/controllers/users';
import apiSchema from './api-schema.json';
import { apiErrorValidator } from './middlewares/api-error-validator';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import logger from './logger';
import expressPino from 'express-pino-logger';

export class SetupServer extends Server {
  constructor(private port = 3001) {
    super();
  }
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    this.docsSetup();
    await this.setupMongo();
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino(logger));
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }
  private async setupMongo(): Promise<void> {
    await database.connect();
  }

  private async docsSetup(): Promise<void> {
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true, //we do it
        validateResponses: true,
      })
    );
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`Server listening on port ${this.port}`);
    });
  }

  private setupController(): void {
    const articlesController = new ArticlesController();
    const usersController = new UsersController();
    this.addControllers([articlesController, usersController]);
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  public getApp(): Application {
    return this.app;
  }
}
