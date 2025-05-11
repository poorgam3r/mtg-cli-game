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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
jest.mock('inquirer', () => ({
    prompt: jest.fn().mockResolvedValue({ action: 'Exit' }),
}));
describe('wait', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should resolve after the specified time', () => __awaiter(void 0, void 0, void 0, function* () {
        const start = Date.now();
        yield (0, index_1.wait)(100); // Wait for 100ms
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(100);
    }));
});
