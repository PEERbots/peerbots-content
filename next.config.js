const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  basePath: isProd ? "/peerbots-content" : "",
  assetPrefix: isProd ? "/peerbots-content/" : "",
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
