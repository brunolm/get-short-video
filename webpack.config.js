const [server, client] = require('nullstack/webpack.config')

function customClient(...args) {
  const config = client(...args)
  const rule = config.module.rules.find((rule) => rule.test && rule.test.test('.css'))
  rule.use.push({
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  })
  return config
}

module.exports = [server, customClient]
