// @ts-check
/** @typedef {{ mode: 'development' | 'production', path: string, name?: string }} CreateWebpackConfigOpts */
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Create the webpack config for a module package
 * @param {CreateWebpackConfigOpts} opts
 * @return {object} Webpack Configuration
 */
function createWebpackConfig(opts) {
	return {
		mode: opts.mode || 'production',
		devtool: 'cheap-source-map',
		entry: './src/index.ts',
		output: {
			path: opts.path + 'dist',
			filename: `interject${opts.name ? `-${opts.name}` : ''}.js`,
		},
		plugins: [
			new TsConfigWebpackPlugin(),
			new HtmlWebpackPlugin({
				title: `Interject${opts.name ? ` - ${opts.name}` : ''}`,
			}),
		],
	};
}

// default config
module.exports = {
	mode: 'production',
	devtool: 'cheap-source-map',
	entry: './src/index.ts',
	output: {
		path: 'dist',
		filename: 'interject.js',
	},
	plugins: [
		new TsConfigWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Interject',
		}),
	],
};

exports.createWebpackConfig = createWebpackConfig;
