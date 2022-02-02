module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  devServer: {
    port: 8888,
    disableHostCheck: true,
  },
};
