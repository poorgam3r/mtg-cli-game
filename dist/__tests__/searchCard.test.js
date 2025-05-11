"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
jest.mock('axios');
const mockedAxios = axios_1.default;
jest.mock('inquirer', () => ({
    prompt: jest.fn().mockResolvedValue({ action: 'Exit' }),
}));
describe('searchCard', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should fetch card details from Scryfall API', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                id: '123',
                name: 'Black Lotus',
                type_line: 'Artifact',
                oracle_text: '{T}: Add three mana of any one color.',
                raw_json: {},
            },
        });
        const card = yield (0, index_1.searchCard)('Black Lotus');
        expect(card.name).toBe('Black Lotus');
        expect(card.type_line).toBe('Artifact');
        expect(card.oracle_text).toBe('{T}: Add three mana of any one color.');
    }));
    it('should handle errors when the card is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValueOnce(new Error('Card not found'));
        yield expect((0, index_1.searchCard)('Nonexistent Card')).rejects.toThrow('Card not found');
    }));
});
