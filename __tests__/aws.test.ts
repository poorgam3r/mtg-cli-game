import { getSecret } from '../index';

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
  it('should fetch and parse secrets from AWS Secrets Manager', async () => {
    const secret = await getSecret('mtg-cli-secrets');
    expect(secret).toEqual({
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'example-key',
    });
  });
});
