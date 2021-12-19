const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  assetPrefix: isProd ? '/peerbots-content/' : '',
  images: {
    loader: 'akamai',
    path: ''
  },
}

module.exports = nextConfig