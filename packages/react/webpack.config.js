// @ts-check
const createWebpackConfig = require('@interject/config-webpack');

module.exports = createWebpackConfig({
	path: __dirname,
	name: 'interject-react',
	library: 'InterjectReactPlugin',
});
