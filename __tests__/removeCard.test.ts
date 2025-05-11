import { removeCard } from '../index';
import inquirer from 'inquirer';

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('removeCard', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should remove a card from the deck', async () => {
    const deck = [{ id: '1', name: 'Black Lotus' }];
    (
      inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>
    ).mockResolvedValueOnce({ index: '1' });

    await removeCard(deck);
    expect(deck).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Removed Black Lotus from deck.')
    );
  });

  it('should handle invalid index input', async () => {
    const deck = [{ id: '1', name: 'Black Lotus' }];
    (
      inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>
    ).mockResolvedValueOnce({ index: '5' });

    await removeCard(deck);
    expect(deck).toHaveLength(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid index.')
    );
  });
});
