const path = require('path')
const Webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = {
    entry: './src/index.jsx',
    mode: IS_DEV ? 'development' : 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].min.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx']
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        host: '127.0.0.1',
        port: 3000,
        open: true
    },
    plugins: [
        new Webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer]
            }
        }),
        new HtmlWebpackPlugin({
            template: './template/index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './assets', to: 'assets' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/styles.min.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /(node_modules)/,
                use: { loader: 'babel-loader' }
            },
            {
                test: /\.scss$|\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.pdf$|\.webp$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/',
                    name: 'name=[name].[ext]'
                },
                type: 'asset'
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
}
