// rollup.config.js
export default {
  input: "src/index.js",
  external: (id) => id === "semver" || id.startsWith("semver/"),
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
};
