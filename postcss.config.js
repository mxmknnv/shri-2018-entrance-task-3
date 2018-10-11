module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-custom-properties': {},
    'postcss-calc': {},
    autoprefixer: env === 'production' ? { browsers: ['last 2 versions'] } : false,
    cssnano: env === 'production' ? { preset: 'default' } : false,
  },
});
