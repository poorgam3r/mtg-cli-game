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
jest.mock('@aws-sdk/client-secrets-manager', () => {
    return {
        SecretsManagerClient: jest.fn().mockImplementation(() => ({
            send: jest.fn().mockResolvedValue({
                SecretString: JSON.stringify({
                    supabaseUrl: 'https://example.supabase.co',
                    supabaseKey: 'example-key',
                }),
            }),
        })),
        GetSecretValueCommand: jest.fn(),
    };
});
describe('getSecret', () => {
    it('should fetch and parse secrets from AWS Secrets Manager', () => __awaiter(void 0, void 0, void 0, function* () {
        const secret = yield (0, index_1.getSecret)('mtg-cli-secrets');
        expect(secret).toEqual({
            supabaseUrl: 'https://example.supabase.co',
            supabaseKey: 'example-key',
        });
    }));
});
