import { Article } from '@src/models/Articles';
import nock from 'nock';
import * as db from '@test/fake-database';
import articlesFromMongo from '@test/fixtures/articles_from_mongodb.json';

describe('Article API functional tests', () => {
  beforeEach(async () => {
    await Article.insertMany(articlesFromMongo);
  });

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    db.closeDatabase();
  });

  afterEach(async () => {
    db.clearDatabase();
  });

  it('should return articles when call API', async () => {
    nock('http://127.0.0.1:34609', { encodedQueryParams: true })
      .get('/api/articles')
      .reply(200, articlesFromMongo);
    const { body, status } = await global.testRequest.get('/api/articles');
    expect(status).toBe(200);
  });
  it('should create an article', async () => {
    const response = {
      _id: '61b271b9cdc26f1b4cfe45d9',
      title: 'India, Brazil agree to enhance space cooperation',
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      updatedAt: '2021-12-09T21:14:33.485Z',
      featured: true,
      id: 11523,
      createdAt: '2021-12-09T21:14:33.485Z',
      __v: 0,
    };
    const newArticle = {
      title: 'India, Brazil agree to enhance space cooperation',
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      imageUrl:
        'https://spacenews.com/wp-content/uploads/2021/12/Modi-and-Putin-copy.jpg',
      newsSite: 'SpaceNews',
      summary:
        'India and Russia agreed Dec. 6 to strengthen cooperation in the space sector, including human spaceflight programs and satellite navigation.',
      publishedAt: '2021-12-07T16:26:45.000Z',
      updatedAt: '2021-12-07T16:26:45.517Z',
      featured: true,
    };

    nock('http://127.0.0.1:43189', { encodedQueryParams: true })
      .post('/api/articles')
      .reply(200, response);

    const { body, status } = await global.testRequest
      .post('/api/articles')
      .send(newArticle);
    expect(status).toEqual(200);
    expect(body).toHaveProperty('_id');
  });

  it('should return an error if not pass data correctly', async () => {
    const newArticle = {
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      imageUrl:
        'https://spacenews.com/wp-content/uploads/2021/12/Modi-and-Putin-copy.jpg',
      newsSite: 'SpaceNews',
      summary:
        'India and Russia agreed Dec. 6 to strengthen cooperation in the space sector, including human spaceflight programs and satellite navigation.',
      publishedAt: '2021-12-07T16:26:45.000Z',
      updatedAt: '2021-12-07T16:26:45.517Z',
      featured: true,
    };
    const { body, status } = await global.testRequest
      .post('/api/articles')
      .send(newArticle);
    expect(status).toEqual(500);
    expect(body).toEqual({ error: 'Something went wrong' });
  });

  it('should delete a article', async () => {
    const _id = '61a405f558c42e2dc37a94cd';

    const { body, status } = await global.testRequest.delete(
      `/api/articles/${_id}`
    );

    expect(status).toEqual(200);
    expect(body).not.toBeNull();
    expect(body?._id).toEqual(_id);
  });
  it('should return null when passing wrong or inexistent id', async () => {
    const _id = '61b271b9cdc26f1b4cfe45d9';
    const { body, status } = await global.testRequest.delete(
      `/api/articles/${_id}`
    );

    expect(status).toEqual(200);
    expect(body).toBeNull();
  });

  it('should update an existing article', async () => {
    const _id = '61a405f558c42e2dc37a94cd';
    const article = {
      _id: '61a405f558c42e2dc37a94cd',
      id: 13165,
      title: 'India, Brazil agree to enhance space cooperation',
      url: 'https://spacenews.com/india-russia-agree-to-enhance-space-cooperation/',
      updatedAt: '2021-12-09T21:14:33.485Z',
      featured: true,
      createdAt: '2021-12-09T21:14:33.485Z',
      __v: 0,
    };

    const { body, status } = await global.testRequest
      .put(`/api/articles/${_id}`)
      .send(article);

    expect(status).toEqual(200);
    expect(body).not.toBeNull();
  });
});
