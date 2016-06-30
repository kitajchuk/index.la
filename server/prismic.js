var prismic = require( "prismic.io" );
var helpers = require( "./prismic-helpers" );
var apiAccess = "https://index-la.cdn.prismic.io/api";



module.exports = function ( req, res ) {
    // Need to retrieve a `type` field from request params
    var type = "artist";

    // Need to populate an dictionary of results from the api form
    var docs = {};

    prismic.api( apiAccess, undefined ).then(function ( api ) {
        // Recursively retrieve all documents for a ref
        // Maximum pageSize allowed is 100, so we'll opt in for that
        // https://developers.prismic.io/documentation/api-documentation#json-responses

        var handle = function () {
            docs[ type ] = helpers.getLinkedDocuments( type, docs );

            res.json({
                success: true,
                results: docs
            });
        };

        // Query syntax: query( '[:d = any(document.type, ["artist"])]' )
        var query = function ( page ) {
            api.form( "everything" ).ref( api.master() ).page( page ).pageSize( 100 ).submit().then(function ( json ) {
                json.results.forEach(function ( document ) {
                    if ( !docs[ document.type ] ) {
                        docs[ document.type ] = [];
                    }

                    docs[ document.type ].push( document );
                });

                if ( json.next_page ) {
                    query( (page + 1) );

                } else {
                    handle();
                }

            }).catch(function ( error ) {
                res.json({
                    success: false,
                    error: error
                });
            });
        };

        query( 1 );

    }).catch(function ( error ) {
        res.json({
            success: false,
            error: error
        });
    });
};
