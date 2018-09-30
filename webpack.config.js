const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-source-map',
	entry: './src/index.ts',
	output: {
		path: __dirname + '/dist',
		filename: 'di.js',
	},
	plugins: [
		new TsConfigWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'DI Example',
		}),
	],
};
