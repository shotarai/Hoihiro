module.exports = {
  backend: {
    output: {
      mode: "tags-split",
      target: "src/gen/backend.ts",
      schemas: "src/gen/schema",
      baseUrl: "http://localhost:8000",
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
    input: {
      target: "../backend/api.yml",
    },
  },
};
