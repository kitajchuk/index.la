/**
 *
 * Prismic api-update data object model:
 * The `releases` object can have several values
 *      releases: { addition: [ [Object] ] }
 *      releases: { update: [ [Object] ] }
 *      releases: { deletion: [ [Object] ] }
 * {
 *     releases:    {object},
 *     bookmarks:   {object},
 *     masks:       {object},
 *     collection:  {object},
 *     tags:        {object},
 *     experiments: {object},
 *     domain:      {string},
 *     apiUrl:      {string},
 *     secret:      {string}
 * }
 *
 * WebSocketServer Event Names:
 * index-stream
 * index-complete
 * index-document
 * index-documents
 *
 */
var prismic = require( "./lib/prismic" );
var sockets = require( "./lib/sockets" );
var http = require( "http" );
var express = require( "express" );
var bodyParser = require( "body-parser" );
var expressApp = express();
var serverApp = http.Server( expressApp );
var expressPort = (process.env.NODE_ENV === "development" ? 8000 : 80);
var prismicSecret = "Sheena is a punk rocker";
var WebSocketServer = require( "websocket" ).server;
var websocketServer = new WebSocketServer({
    httpServer: serverApp,
    autoAcceptConnections: false
});



var checkOrigin = function ( req, res, next ) {
    res.set( "Access-Control-Allow-Origin", req.headers.origin );

    next();
};



websocketServer.on( "request", function ( req ) {
    req.accept( "echo-protocol", req.origin );
});
websocketServer.on( "connect", function ( connection ) {
    console.log( "WebSocketServer: Connected" );

    connection.sockets = new sockets.Class( connection );
    connection.prismic = new prismic.Class( connection );

    // connection.sockets.on( "index-document", function ( getData ) {
    //     connection.prismic.getDocumentBySlug( getData.slug, getData.type ).then(function ( resData ) {
    //         connection.sockets.success( "index-document", resData );
    //
    //     }).catch(function ( error ) {
    //         console.log( "Get document data error.", error );
    //     });
    // });

    connection.sockets.on( "index-documents", function ( getData ) {
        connection.prismic.getDocumentsByType( getData.type ).then(function ( resData ) {
            connection.sockets.success( "index-documents", resData );

        }).catch(function ( error ) {
            console.log( "Get documents data error.", error );
        });
    });

    connection.prismic.getTertiarySiteData().then(function () {
        connection.sockets.success( "index-complete", {} );

    }).catch(function ( error ) {
        console.log( "Tertiary site data error.", error );
    });
});
websocketServer.on( "close", function ( connection ) {
    console.log( "WebSocketServer: Closed" );
});



expressApp.use( bodyParser.json( {limit: "100mb"} ) );
expressApp.use( bodyParser.urlencoded( {limit: "100mb", extended: true} ) );
// expressApp.get( "/publish", checkOrigin, function ( req, res ) {
//     console.log( req.body );
// });
serverApp.listen( expressPort );



console.log( "node.theindex.la running on port " + expressPort );
