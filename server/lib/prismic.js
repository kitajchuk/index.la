var prismic = require( "prismic.io" );
var helpers = require( "./prismic-helpers" );
var apiAccess = "https://index-la.cdn.prismic.io/api";



/**
 *
 * @description Delete what will not be used on a document
 * @method purge
 * @param {object} doc The document
 * @returns {object}
 * @private
 *
 */
var purge = function ( doc ) {
    delete doc.fragments;
    delete doc.slugs;
    delete doc.slug;
    delete doc.href;
    delete doc.uid;

    return doc;
};



/**
 *
 * @description Create the prismic utility class
 * @class Class
 * @param {object} connection The WebSocketServer connection
 * @public
 *
 */
var Class = function ( connection ) {
    this.api = null;
    this.connection = connection;
    this.linkDict = {
        nav: [],
        meta: [],
        sort: [],
        type: [],
        city: [],
        social: [],
        region: [],
        category: []
    };
};



Class.prototype = {
    /**
     *
     * @public
     * @instance
     * @method getTertiarySiteData
     * @memberof Class
     * @description Get all tertiary data to populate the client application.
     * @returns {Promise}
     *
     */
    getTertiarySiteData: function () {
        var self = this;
        var linkTypes = [
            "navs",
            "meta",
            "sorts",
            "types",
            "cities",
            "socials",
            "regions",
            "categories"
        ];
        var statLength = linkTypes.length;
        var killLength = linkTypes.length;

        return new Promise(function ( resolve, reject ) {
            prismic.api( apiAccess, undefined ).then(function ( api ) {
                // Store api for later use
                self.api = api;

                // Build document link dictionary for later use
                var links = function () {
                    return new Promise(function ( res, rej ) {
                        var link = function ( form ) {
                            api.form( form ).ref( api.master() ).page( 1 ).pageSize( 100 ).submit().then(function ( json ) {
                                var type = json.results[ 0 ].type;

                                json.results.forEach(function ( document ) {
                                    document.data = helpers._cleanDataKeys( document.data );

                                    self.linkDict[ type ].push( purge( document ) );
                                });

                                killLength--;

                                self.connection.sockets.success( "index-stream", {
                                    type: type,
                                    stat: 100 -  killLength / statLength * 100,
                                    value: self.linkDict[ type ]
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

                links().then(function () {
                    resolve();
                });

            }).catch(function ( error ) {
                reject( error );
            });
        });
    },


    /**
     *
     * @public
     * @instance
     * @method getDocumentsByType
     * @memberof Class
     * @description Get a list of documents by their type.
     * @returns {Promise}
     *
     */
    getDocumentsByType: function ( type ) {
        var self = this;
        var response = [];

        return new Promise(function ( resolve, reject ) {
            var query = function ( page ) {
                self.api.form( type ).ref( self.api.master() ).page( page ).pageSize( 100 ).submit().then(function ( json ) {
                    var documents = helpers.getLinkedDocuments( json.results, self.linkDict );

                    documents.forEach(function ( document ) {
                        response.push( purge( document ) );
                    });

                    if ( json.next_page ) {
                        query( (page + 1) );

                    } else {
                        resolve( response );
                    }

                }).catch(function ( error ) {
                    reject( error );
                });
            };

            query( 1 );
        });
    },


    /**
     *
     * @public
     * @instance
     * @method getDocumentBySlug
     * @memberof Class
     * @description Get a document by its slug and type.
     * @returns {Promise}
     *
     */
    // getDocumentBySlug: function ( slug, type ) {
    //     var self = this;
    //     var response = [];
    //     var query = [
    //         prismic.Predicates.at( "document.type", type ),
    //         prismic.Predicates.fulltext( "document", slug )
    //     ];
    //
    //     return new Promise(function ( resolve, reject ) {
    //         console.log( slug, type );
    //         self.api.query( query ).then(function ( json ) {
    //             var documents = helpers.getLinkedDocuments( json.results, self.linkDict );
    //
    //             documents.forEach(function ( document ) {
    //                 response.push( purge( document ) );
    //             });
    //
    //             resolve( response[ 0 ] );
    //
    //         }).catch(function ( error ) {
    //             reject( error );
    //         });
    //     });
    // }
};



module.exports = {
    Class: Class
};
