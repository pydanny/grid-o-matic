module.exports = {
  reactStrictMode: true,
  // basePath: "/octogrid",
  // assetPrefix: process.env.isProduction === "true" ? "/octogrid/" : "",
  assetPrefix: process.env.isProduction === 'true' ? '' : '',
  env: {
    isProduction: 'false',
  },
};
