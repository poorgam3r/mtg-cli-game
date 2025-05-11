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
const index_1 = require("../index");
const inquirer_1 = __importDefault(require("inquirer"));
jest.mock('inquirer', () => ({
    prompt: jest.fn(),
}));
describe('removeCard', () => {
    let consoleSpy;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });
    afterEach(() => {
        consoleSpy.mockRestore();
    });
    it('should remove a card from the deck', () => __awaiter(void 0, void 0, void 0, function* () {
        const deck = [{ id: '1', name: 'Black Lotus' }];
        inquirer_1.default.prompt.mockResolvedValueOnce({ index: '1' });
        yield (0, index_1.removeCard)(deck);
        expect(deck).toHaveLength(0);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Removed Black Lotus from deck.'));
    }));
    it('should handle invalid index input', () => __awaiter(void 0, void 0, void 0, function* () {
        const deck = [{ id: '1', name: 'Black Lotus' }];
        inquirer_1.default.prompt.mockResolvedValueOnce({ index: '5' });
        yield (0, index_1.removeCard)(deck);
        expect(deck).toHaveLength(1);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid index.'));
    }));
});
