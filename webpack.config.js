var path = require( "path" );
var autoprefixer = require( "autoprefixer" );



module.exports = {
    devtool: "source-map",


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


    entry: {
        "app": path.resolve( __dirname, "source/js/app.js" )
    },


    output: {
        path: path.resolve( __dirname, "static/js" ),
        filename: "[name].js"
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


    postcss: [
        autoprefixer({
            browsers: [
                "last 2 versions"
            ]
        })
    ],


    sassLoader: {
        includePaths: [
            path.resolve( __dirname, "source/sass" )
        ]
    }
};
