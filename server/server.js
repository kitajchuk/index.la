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
 */
var prismic = require( "./prismic" );
var express = require( "express" );
var expressApp = express();
var expressPort = (process.env.NODE_ENV === "development" ? 8000 : 80);


expressApp.get( "/", function ( req, res, next ) {
    res.set( "Access-Control-Allow-Origin", req.headers.origin );

    next();

}, function ( req, res ) {
    prismic( req, res );
});



expressApp.listen( expressPort );
