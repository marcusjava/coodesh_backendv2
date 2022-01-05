import { ArticleService } from '@src/services/article';
import { Controller, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from './index';

const services = new ArticleService();

@Controller('api/articles')
export class ArticlesController extends BaseController {
  @Get('')
  public async getArticles(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) | 1;
    const limit = parseInt(req.query.limit as string) | 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
      const articles = await services.getArticlesFromDB();
      const results = articles.slice(startIndex, endIndex);
      res.status(200).json(results);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
  @Post('')
  public async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const article = await services.saveArticleInDB(req.body);
      res.status(200).json(article);
    } catch (error: any) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }

  @Post('db')
  public async createArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await services.saveArticlesInDB();
      res.status(200).json(articles);
    } catch (error: any) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }

  @Put(':id')
  public async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const article = await services.updateArticleFromDB(req.body, id);
      res.status(200).json(article);
    } catch (error: any) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
  @Get(':id')
  public async getArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const article = await services.getArticleFromDB(id);
      res.status(200).json(article);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }

  @Delete(':id')
  public async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const article = await services.deleteArticleFromDB(id);
      res.status(200).json(article);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
