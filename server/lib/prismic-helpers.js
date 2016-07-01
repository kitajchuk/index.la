var uuid = 0;


/**
 *
 * @description Helper methods for prismic.io datas
 * @namespace helpers
 * @public
 *
 */
var helpers = {
    /**
     *
     * @public
     * @method getLinkedDocumentBySlug
     * @param {string} key The document type
     * @param {string} slug The document SLUG
     * @param {array} dict The array of documents of this type
     * @memberof helpers
     * @description Get a document by type from an array with its documents linked up.
     * @returns {object}
     *
     */
    getLinkedDocumentBySlug ( key, slug, dict ) {
        var i = dict[ key ].length;
        var ret = null;
        var data = JSON.parse( JSON.stringify( dict ) );

        for ( i; i--; ) {
            if ( data[ key ][ i ].slug === slug ) {
                ret = this._getDocumentWithLinks( data[ key ][ i ], data );
                break;
            }
        }

        return ret;
    },


    /**
     *
     * @public
     * @method getLinkedDocuments
     * @param {string} docs The documents array
     * @param {array} dict The array of documents of this type
     * @memberof helpers
     * @description Get documents by type with their documents linked up.
     * @returns {array}
     *
     */
    getLinkedDocuments ( docs, dict ) {
        uuid = 0;

        const ret = [];
        const data = JSON.parse( JSON.stringify( dict ) );

        docs.forEach(( doc ) => {
            ret.push( this._getDocumentWithLinks( doc, data ) );
        });

        return ret;
    },


    /**
     *
     * @private
     * @method _cleanDataKeys
     * @param {object} data The documents data to clean keys for
     * @memberof helpers
     * @description Get the data for a document with cleaned keys.
     *              Convert keys from `data['artist.name']` to just `data.name`
     * @returns {object}
     *
     */
    _cleanDataKeys ( data ) {
        var i = null;
        var ret = {};

        for ( i in data ) {
            if ( data.hasOwnProperty( i ) ) {
                ret[ i.replace( /^.*?\./, "" ) ] = data[ i ];
            }
        }

        return ret;
    },


    /**
     *
     * @private
     * @method _getDocumentLink
     * @param {object} link The `Link.document`
     * @param {array} dict The array of documents to look in
     * @memberof helpers
     * @description Get the full reference for a `Link.document`
     * @returns {object}
     *
     */
    _getDocumentLink ( link, dict ) {
        var i = dict[ link.type ].length;
        var ret = null;

        for ( i; i--; ) {
            if ( dict[ link.type ][ i ].id === link.id ) {
                ret = dict[ link.type ][ i ];
                break;
            }
        }

        ret.data = this._cleanDataKeys( ret.data );

        return ret;
    },


    /**
     *
     * @private
     * @method _getDocumentWithLinks
     * @param {object} doc The Document
     * @param {array} dict The array of documents to look in
     * @memberof helpers
     * @description Get a document with all `Link.document` and `Group` fields pulled into it
     * @returns {object}
     *
     */
    _getDocumentWithLinks ( doc, dict ) {
        var i = null;
        var k = null;
        var ret = {
            id: doc.id,
            slug: doc.slug,
            type: doc.type,
            data: {},
            show: true,
            uuid: uuid++
        };

        for ( i in doc.data ) {
            if ( doc.data.hasOwnProperty( i ) ) {
                k = i.replace( doc.type + ".", "" );

                // Skip broken document links
                if ( doc.data[ i ].type === "Link.document" && !doc.data[ i ].value.isBroken ) {
                    ret.data[ k ] = {
                        type: "Link.document",
                        value: this._getDocumentLink( doc.data[ i ].value.document, dict )
                    };

                } else if ( doc.data[ i ].type === "Group" ) {
                    var j = 0;
                    var value = null;
                    var type = null;
                    var len = doc.data[ i ].value.length;
                    var elem = null;

                    ret.data[ k ] = {
                        type: "Group",
                        value: []
                    };

                    for ( j; j < len; j++ ) {
                        value = doc.data[ i ].value[ j ];

                        for ( type in value ) {
                            if ( value.hasOwnProperty( type ) ) {
                                // Skip broken document links
                                if ( value[ type ].type === "Link.document" && !value[ type ].value.isBroken ) {
                                    ret.data[ k ].value.push({
                                        type: "Link.document",
                                        value: this._getDocumentLink( value[ type ].value.document, dict )
                                    });

                                // Skip broken document links
                                } else if ( !value[ type ].value.isBroken ) {
                                    ret.data[ k ].value.push( value[ type ] );
                                }
                            }
                        }
                    }

                } else {
                    ret.data[ k ] = doc.data[ i ];
                }
            }
        }

        return ret;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
module.exports = helpers;
