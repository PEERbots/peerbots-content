const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  basePath: '/peerbots-content',
  assetPrefix: isProd ? '/peerbots-content/' : '',
  images: {
    loader: 'akamai',
    path: ''
  },
  trailingSlash: true,
}

module.exports = nextConfig