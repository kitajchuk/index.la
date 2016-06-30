var path = require( "path" );
var autoprefixer = require( "autoprefixer" );
var BrowserSyncPlugin = require( "browser-sync-webpack-plugin" );
var shared = {
    resolve: {
        root: path.resolve( __dirname ),
        packageMains: [
            "webpack",
            "browserify",
            "web",
            "hobo",
            "main"
        ]
    },
    module: {
        preLoaders: [
            // ESLint
            {
                test: /source\/js\/.*\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            }
        ],
        loaders: [
            // Babel
            {
                test: /source\/js\/.*\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: [
                        "es2015"
                    ]
                }
            },
            // Expose
            {
                test: /(hobo|hobo.build)\.js$/,
                loader: "expose?hobo"
            },
            // Sass
            {
                test: /\.scss$/,
                loader: "file-loader?name=../css/[name].css!postcss-loader!sass-loader?sourceMap"
            }
        ]
    },
    sassLoader: {
        includePaths: [
            path.resolve( __dirname, "source/sass" )
        ]
    },
    postcss: [
        autoprefixer({
            browsers: [
                "last 2 versions"
            ]
        })
    ]
};



var app = {
    devtool: "source-map",
    resolve: shared.resolve,
    entry: {
        "app": path.resolve( __dirname, "source/js/app.js" )
    },
    output: {
        path: path.resolve( __dirname, "static/js" ),
        filename: "[name].js"
    },
    module: shared.module,
    postcss: shared.postcss,
    sassLoader: shared.sassLoader
};



var splash = {
    devtool: "source-map",
    plugins: [
        new BrowserSyncPlugin({
            open: true,
            host: "localhost",
            port: 1338,
            server: {
                baseDir: "./splash/"
            }
        })
    ],
    resolve: shared.resolve,
    entry: {
        "splash": path.resolve( __dirname, "source/js/splash.js" )
    },
    output: {
        path: path.resolve( __dirname, "splash/js" ),
        filename: "[name].js"
    },
    module: shared.module,
    postcss: shared.postcss,
    sassLoader: shared.sassLoader
};



module.exports = [
    app,
    splash
];
