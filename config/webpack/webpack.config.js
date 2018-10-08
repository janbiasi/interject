// @ts-check
/** @typedef {{ path: string, name: string, library: string }} CreateWebpackConfigOpts */
const path = require('path');
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pascalCase = (s) => s.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

/**
 * Create the webpack config for a module package
 * @param {CreateWebpackConfigOpts} opts
 * @return {object} Webpack Configuration
 */
function createWebpackConfig(opts) {
	return [
		{
			mode: 'production',
			entry: path.join(opts.path, '/src/index.ts'),
			devtool: 'source-map',
			optimization: {
				minimize: true,
				namedModules: true,
				portableRecords: true,
			},
			output: {
				library: opts.library,
				libraryTarget: 'umd',
				auxiliaryComment: '@Interject/* library definition',
				path: path.join(opts.path, '/dist'),
				filename: `${opts.name}.min.js`,
				strictModuleExceptionHandling: true,
			},
			plugins: [
				new TsConfigWebpackPlugin({
					mode: 'production',
					configFile: path.join(opts.path, 'tsconfig.json')
				}),
			],
		},
		{
			mode: 'development',
			devtool: 'cheap-module-eval-source-map',
			entry: path.join(opts.path, '/src/index.ts'),
			output: {
				library: opts.library,
				libraryTarget: 'umd',
				path: path.join(opts.path, '/dist'),
				filename: `${opts.name}.js`,
				umdNamedDefine: true,
			},
			plugins: [
				new TsConfigWebpackPlugin({
					mode: 'development',
					configFile: path.join(opts.path, 'tsconfig.json')
				}),
				new HtmlWebpackPlugin({
					title: `Interject HTML Testing`,
				}),
			],
		},
	];
}

module.exports = createWebpackConfig;
