import axios from 'axios';
import { throttledGetDataFromApi } from './index';
import { throttle } from 'lodash';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() =>
      Promise.resolve({ data: { id: 1, title: 'test post' } }),
    ),
  })),
}));

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockData = { id: 1, title: 'test post' };
  const relativePath = '/posts/1';

  beforeEach(() => {
    jest.clearAllMocks();

    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });

    (throttle as jest.Mock).mockImplementation((fn) => fn);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    await throttledGetDataFromApi(relativePath);

    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockData);
  });
});
