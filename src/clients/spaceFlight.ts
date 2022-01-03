import * as HTTPUtil from '@src/util/request';
import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';
import { ArticleI } from '@src/models/Articles';

/**
 * This error type is used when a request reaches out to the SpaceFlight API but returns an error
 */
export class SpacFlightUnexpectedResponseError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * This error type is used when something breaks before the request reaches out to the SpaceFlight API
 * eg: Network error, or request validation error
 */
export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to SpaceFlight API';
    super(`${internalMessage}: ${message}`);
  }
}

export class SpaceFlightResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the SpaceFlight service';
    super(`${internalMessage}: ${message}`);
  }
}

/**
 * We could have proper type for the configuration
 */
const spaceflightResourceConfig: IConfig = config.get(
  'App.resources.SpaceFlight'
);

export class SpaceFlight {
  constructor(protected request = new HTTPUtil.Request()) {}

  public async getArticles(): Promise<ArticleI[]> {
    try {
      const response = await this.request.get<ArticleI[]>(
        `${spaceflightResourceConfig.get('apiUrl')}/articles`
      );
      return response.data;
    } catch (error: any) {
      /**
       * This is handling the Axios errors specifically
       */
      if (HTTPUtil.Request.isRequestError(error)) {
        throw new SpaceFlightResponseError(
          `Error: ${JSON.stringify(error.response.data)} Code: ${
            error.response.status
          }`
        );
      }
      throw new ClientRequestError(error.message);
    }
  }
  public async getArticlesCount(): Promise<number> {
    try {
      const response = await this.request.get<number>(
        `${spaceflightResourceConfig.get('apiUrl')}/articles/count`
      );
      return response.data;
    } catch (error: any) {
      /**
       * This is handling the Axios errors specifically
       */
      if (HTTPUtil.Request.isRequestError(error)) {
        throw new SpaceFlightResponseError(
          `Error: ${JSON.stringify(error.response.data)} Code: ${
            error.response.status
          }`
        );
      }
      throw new ClientRequestError(error.message);
    }
  }
}
