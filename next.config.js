module.exports = {
  reactStrictMode: true,
  // basePath: "/octogrid",
  assetPrefix: process.env.isProduction === "true" ? "/octogrid/" : "",
  env: {
    isProduction: "false"
  }
}
