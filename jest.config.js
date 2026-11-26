module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      { tsconfig: { target: "ES2020", module: "commonjs", strict: true, esModuleInterop: true } },
    ],
  },
};
