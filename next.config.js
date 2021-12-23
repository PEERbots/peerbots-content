const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  assetPrefix: isProd ? '/peerbots-content/' : '',
  images: {
    loader: 'akamai',
    path: ''
  },
  trailingSlash: true,
}

module.exports = nextConfig