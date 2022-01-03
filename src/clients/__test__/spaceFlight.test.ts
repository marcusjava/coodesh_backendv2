import { SpaceFlight } from '@src/clients/spaceFlight';
import spaceFlightArticles from '@test/fixtures/space_flight_articles.json';
import * as HTTPUtils from '@src/util/request';

jest.mock('@src/util/request');

describe('SpaceFlight client', () => {
  /**
   * Used for static method's mocks
   */
  const MockedRequestClass = HTTPUtils.Request as jest.Mocked<
    typeof HTTPUtils.Request
  >;
  const mockedRequest =
    new HTTPUtils.Request() as jest.Mocked<HTTPUtils.Request>;

  it('should return articles from API', async () => {
    mockedRequest.get.mockResolvedValue({
      data: spaceFlightArticles,
    } as HTTPUtils.Response);

    const space = new SpaceFlight(mockedRequest);
    const response = await space.getArticles();
    expect(response).toEqual(spaceFlightArticles);
  });

  it('should get a generic error from SpaceFlight service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
    const space = new SpaceFlight(mockedRequest);
    await expect(space.getArticles()).rejects.toThrow(
      'Unexpected error when trying to communicate to SpaceFlight API: Network Error'
    );
  });

  it('should return a correctly number of articles', async () => {
    mockedRequest.get.mockResolvedValue({
      data: 25,
    } as HTTPUtils.Response);
    const space = new SpaceFlight(mockedRequest);
    const response = await space.getArticlesCount();
    expect(response).toEqual(25);
  });
});
