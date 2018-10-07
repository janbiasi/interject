// @ts-check
const { createWebpackConfig } = require('@interject/config-webpack/webpack.config');

module.exports = createWebpackConfig({
	mode: 'development',
	path: __dirname,
	name: 'mobx',
});
