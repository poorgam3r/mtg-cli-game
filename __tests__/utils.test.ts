import { wait } from '../index';

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({ action: 'Exit' }),
}));

describe('wait', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should resolve after the specified time', async () => {
    const start = Date.now();
    await wait(100); // Wait for 100ms
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
