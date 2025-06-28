// jest.config.mjs
export default {
  testEnvironment: "node",
  transform: {},
  testTimeout: 20000, // ✅ Sets timeout globally (same as jest.setTimeout)
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
