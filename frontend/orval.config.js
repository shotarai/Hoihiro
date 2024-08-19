module.exports = {
  backend: {
    output: {
      mode: "tags-split",
      target: "src/gen/backend.ts",
      schemas: "src/gen/schema",
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

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
