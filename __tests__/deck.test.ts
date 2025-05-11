import { viewDeck } from '../index';
import 'inquirer';

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({ action: 'Exit' }),
}));

describe('viewDeck', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should display a message if the deck is empty', () => {
    viewDeck([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Your deck is empty.')
    );
  });

  it('should display the cards in the deck', () => {
    const deck = [
      { id: '1', name: 'Black Lotus' },
      { id: '2', name: 'Mox Pearl' },
    ];
    viewDeck(deck);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Your deck:')
    );
    expect(consoleSpy).toHaveBeenCalledWith('1. Black Lotus');
    expect(consoleSpy).toHaveBeenCalledWith('2. Mox Pearl');
  });
});
