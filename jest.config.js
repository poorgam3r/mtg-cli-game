/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!chalk)', // Ensure Jest processes ES Modules like chalk
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore the dist directory
  modulePathIgnorePatterns: ['/dist/'], // Ignore modules in the dist directory
};
