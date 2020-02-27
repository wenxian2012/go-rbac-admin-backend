module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'font-size-base': '13px',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true,
      },
    },
  },
};
