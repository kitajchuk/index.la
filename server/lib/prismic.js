var prismic = require( "prismic.io" );
var helpers = require( "./prismic-helpers" );
var apiAccess = "https://index-la.cdn.prismic.io/api";



module.exports = function ( connection ) {
    var linkDict = {
        type: [],
        city: [],
        page: [],
        region: [],
        feature: [],
        category: []
    };
    var linkTypes = [
        "types",
        "pages",
        "cities",
        "regions",
        "features",
        "categories"
    ];
    var statLength = linkTypes.length;
    var killLength = linkTypes.length;

    return new Promise(function ( resolve, reject ) {
        prismic.api( apiAccess, undefined ).then(function ( api ) {
            //console.log( api );

            // Delete what will not be used on a document
            var purge = function ( doc ) {
                delete doc.fragments;
                delete doc.slugs;
                //delete doc.tags;
                delete doc.href;
                delete doc.uid;

                return doc;
            };

            // Get all types that will be `Link.document`
            var links = function () {
                return new Promise(function ( res, rej ) {
                    var link = function ( form ) {
                        api.form( form ).ref( api.master() ).page( 1 ).pageSize( 100 ).submit().then(function ( json ) {
                            var type = json.results[ 0 ].type;

                            json.results.forEach(function ( document ) {
                                document.data = helpers._cleanDataKeys( document.data );

                                linkDict[ type ].push( purge( document ) );
                            });

                            killLength--;

                            connection.sockets.success( "index-data", {
                                type: type,
                                stat: 100 -  killLength / statLength * 100,
                                value: linkDict[ type ]
                            });

                            if ( !linkTypes.length ) {
                                res();

                            } else {
                                link( linkTypes.pop() );
                            }
                        });
                    };

                    link( linkTypes.pop() );
                });
            };

            // Handle linking documents for aritsts
            var handle = function ( documents ) {
                documents = helpers.getLinkedDocuments( documents, linkDict );

                killLength--;

                connection.sockets.success( "index-data", {
                    type: "artist",
                    stat: 100 - killLength / statLength * 100,
                    value: documents
                });
            };

            // Query a page of artists
            var query = function ( page ) {
                api.form( "artists" ).ref( api.master() ).page( page ).pageSize( 100 ).submit().then(function ( json ) {
                    var documents = [];

                    if ( !killLength ) {
                        killLength += json.total_pages;
                        statLength += json.total_pages;
                    }

                    json.results.forEach(function ( document ) {
                        documents.push( purge( document ) );
                    });

                    handle( documents );

                    if ( json.next_page ) {
                        query( (page + 1) );

                    } else {
                        resolve();
                    }

                }).catch(function ( error ) {
                    reject( error );
                });
            };

            links().then(function () {
                query( 1 );
            });

        }).catch(function ( error ) {
            reject( error );
        });
    });
};
