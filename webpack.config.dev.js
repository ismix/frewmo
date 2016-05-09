var webpack = require('webpack');

PATHS = {
    app: __dirname + '/app/static/src/js/index',
    src: __dirname + '/app/static/src',
    build: __dirname + '/app/static/dist'
};

module.exports = {  
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        PATHS.app
    ],
    output: {
        path: PATHS.build,
        filename: "bundle.js",
        publicPath: "http://localhost:3000/static/"
    },
    resolve: {
        alias: {
            flexboxgrid: __dirname + "/node_modules/flexboxgrid/dist/flexboxgrid.min.css"
        }
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            loaders: ['react-hot', 'babel'],
            include: PATHS.src
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-module-eval-source-map'
};