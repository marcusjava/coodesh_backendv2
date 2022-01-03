import { ArticleService } from '@src/services/article';
import articlesFromMongo from '@test/fixtures/articles_from_mongodb.json';
import { Article } from '@src/models/Articles';
import * as db from '@test/fake-database';

//jest.mock('@src/services/article');

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await Article.insertMany(articlesFromMongo);
});

afterEach(async () => {
  db.clearDatabase();
});

afterAll(async () => {
  db.closeDatabase();
});

describe('Article services test', () => {
  const mockedService = new ArticleService() as jest.Mocked<ArticleService>;

  const service = new ArticleService();
  it('should return an list of articles from database', async () => {
    const articlesFromDB = await Article.find({});

    const articles = await service.getArticlesFromDB();

    expect(articles).toEqual(articlesFromDB);
  });

  it('should delete an article from databse', async () => {
    const id = '61a405f558c42e2dc37a94ce';
    const deleted = await service.deleteArticleFromDB(id);
    const articles = await service.getArticlesFromDB();
    expect(articles).not.toContain(deleted);
  });

  it('mongoose return null when passed inexistent id', async () => {
    const inexistentId = '61a405f558c42e2dc37a94cc';

    const article = await service.getArticleFromDB(inexistentId);

    expect(article).toEqual(null);
  });

  it('should update an article', async () => {
    const article = {
      _id: '61a405f558c42e2dc37a94cd',
      id: 13165,
      title: 'India, Brazil agree to enhance space cooperation',
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      imageUrl:
        'https://spacenews.com/wp-content/uploads/2021/12/Modi-and-Putin-copy.jpg',
      newsSite: 'SpaceNews',
      summary:
        'India and Russia agreed Dec. 6 to strengthen cooperation in the space sector, including human spaceflight programs and satellite navigation.',
      publishedAt: '2021-12-07T16:26:45.000Z',
      updatedAt: '2021-12-07T16:26:45.517Z',
      featured: false,
    };

    const updated = await service.updateArticleFromDB(
      article,
      '61a405f558c42e2dc37a94cd'
    );

    expect(updated?.title).toEqual(article.title);
    expect(updated?.updatedAt).not.toEqual(article.updatedAt);
  });

  it('creating an article', async () => {
    const article = {
      title: 'Only Brazil agree to enhance space cooperation',
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      imageUrl:
        'https://spacenews.com/wp-content/uploads/2021/12/Modi-and-Putin-copy.jpg',
      newsSite: 'SpaceNews',
      summary:
        'India and Russia agreed Dec. 6 to strengthen cooperation in the space sector, including human spaceflight programs and satellite navigation.',
      publishedAt: '2021-12-07T16:26:45.000Z',
      featured: false,
      events: [
        {
          id: '440',
          provider: 'Launch Library 2',
        },
      ],
      launches: [
        {
          id: '7ccf6526-6c1f-42f6-99d6-83a429249cef',
          provider: 'Launch Library 2',
        },
      ],
    };

    const savedArticle = await service.saveArticleInDB(article);
    expect(savedArticle._id).not.toBeNull();
    expect(savedArticle?.createdAt).not.toBeNull();
  });

  it('should get specific article', async () => {
    const id = '61a405f558c42e2dc37a94cd';

    const article = await service.getArticleFromDB(id);

    expect(article).not.toBeNull();
  });
});
