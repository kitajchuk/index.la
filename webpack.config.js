var path = require( "path" );



module.exports = {
    resolve: {
        root: [
            __dirname,
            path.join( __dirname, "js_libs" ),
            path.join( __dirname, "js_libs", "greensock-js", "src", "uncompressed" ),
            path.join( __dirname, "js_libs", "greensock-js", "src", "uncompressed", "plugins" )
        ]
/*
        alias: {
            TweenLite: path.join( __dirname, "js_libs/greensock-js/src/uncompressed/TweenLite.js" ),
            CSSPlugin: path.join( __dirname, "js_libs/greensock-js/src/uncompressed/plugins/CSSPlugin.js" )
        }
*/
    },


    entry: {
        app: "./source/js/app.js"
    },


    output: {
        path: "./static/js/",
        filename: "app.js"
    },


    module: {
        loaders: [
            {
                test: /source\/js\/.*\.js$/,
                exclude: /node_modules|js_libs/,
                loader: "babel-loader"
            },

            {
                test: /(hobo|hobo.build)\.js$/,
                loader: "expose?hobo"
            }
        ]
    }
};