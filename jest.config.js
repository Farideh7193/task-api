module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  globals: { "ts-jest": { tsconfig: { rootDir: ".", strict: true, esModuleInterop: true } } },
};
