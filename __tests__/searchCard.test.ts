import axios from 'axios';
import { searchCard } from '../index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({ action: 'Exit' }),
}));

describe('searchCard', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch card details from Scryfall API', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: '123',
        name: 'Black Lotus',
        type_line: 'Artifact',
        oracle_text: '{T}: Add three mana of any one color.',
        raw_json: {},
      },
    });

    const card = await searchCard('Black Lotus');
    expect(card.name).toBe('Black Lotus');
    expect(card.type_line).toBe('Artifact');
    expect(card.oracle_text).toBe('{T}: Add three mana of any one color.');
  });

  it('should handle errors when the card is not found', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Card not found'));
    await expect(searchCard('Nonexistent Card')).rejects.toThrow(
      'Card not found'
    );
  });
});
