import { Article, ArticleI } from '@src/models/Articles';
import { InternalError } from '@src/util/errors/internal-error';
import { SpaceFlight } from '@src/clients/spaceFlight';

export class ArticleProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during article service processing: ${message}`);
  }
}

export class ArticleService {
  public async saveArticleInDB(data: ArticleI): Promise<ArticleI> {
    try {
      const spaceClient = new SpaceFlight();
      const count = await spaceClient.getArticlesCount();
      data['id'] = count + 1;
      const article = new Article(data);
      const newArticle = await article.save();
      return newArticle;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }
  public async getArticlesFromDB(): Promise<ArticleI[]> {
    try {
      const articles = await Article.find({});
      return articles;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }

  public async saveArticlesInDB(_limit: number): Promise<ArticleI[]> {
    try {
      const spaceClient = new SpaceFlight();
      const data = await spaceClient.getArticles(_limit);
      const articles = await Article.insertMany(data);
      return articles;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }

  public async getArticleFromDB(_id: string): Promise<ArticleI | null> {
    try {
      const article = await Article.findOne({ _id });
      return article;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }

  public async deleteArticleFromDB(_id: string): Promise<ArticleI | null> {
    try {
      const articleDeleted = await Article.findOneAndDelete({ _id });
      return articleDeleted;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }

  public async updateArticleFromDB(
    data: ArticleI,
    id: string
  ): Promise<ArticleI | null> {
    try {
      const updated = await Article.findByIdAndUpdate(
        { _id: id },
        { ...data },
        { new: true, useFindAndModify: false }
      );
      return updated;
    } catch (error: any) {
      throw new ArticleProcessingInternalError(error.message);
    }
  }
}
