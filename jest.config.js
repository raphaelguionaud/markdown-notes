module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
