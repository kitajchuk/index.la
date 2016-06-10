let uuid = 0;


/**
 *
 * @description Helper methods for prismic.io datas
 * @namespace helpers
 * @public
 *
 */
const helpers = {
    /**
     *
     * @public
     * @method getLinkedDocument
     * @param {string} key The document type
     * @param {string} id The document ID
     * @param {array} dict The array of documents of this type
     * @memberof helpers
     * @description Get a document by type from an array with its documents linked up.
     * @returns {object}
     *
     */
    getLinkedDocument ( key, id, dict ) {
        let i = dict[ key ].length;
        let ret = null;
        const data = JSON.parse( JSON.stringify( dict ) );

        for ( i; i--; ) {
            if ( data[ key ][ i ].id === id ) {
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
     * @param {string} key The document type
     * @param {array} dict The array of documents of this type
     * @memberof helpers
     * @description Get documents by type with their documents linked up.
     * @returns {array}
     *
     */
    getLinkedDocuments ( key, dict ) {
        const ret = [];
        const data = JSON.parse( JSON.stringify( dict ) );

        data[ key ].forEach(( doc ) => {
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
        let i = null;
        const ret = {};

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
        let i = dict[ link.type ].length;
        let ret = null;

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
        let i = null;
        let k = null;
        const ret = {
            id: doc.id,
            slug: doc.slug,
            tags: doc.tags,
            type: doc.type,
            data: {},
            show: true,
            uuid: uuid++
        };

        for ( i in doc.data ) {
            if ( doc.data.hasOwnProperty( i ) ) {
                k = i.replace( `${doc.type}.`, "" );

                if ( doc.data[ i ].type === "Link.document" ) {
                    ret.data[ k ] = {
                        type: "Link.document",
                        value: this._getDocumentLink( doc.data[ i ].value.document, dict )
                    };

                } else if ( doc.data[ i ].type === "Group" ) {
                    let j = doc.data[ i ].value.length;

                    ret.data[ k ] = {
                        type: "Group",
                        value: []
                    };

                    for ( j; j--; ) {
                        let type = null;

                        for ( type in doc.data[ i ].value[ j ] ) {
                            if ( doc.data[ i ].value[ j ].hasOwnProperty( type ) ) {
                                if ( doc.data[ i ].value[ j ][ type ].type === "Link.document" ) {
                                    ret.data[ k ].value.push({
                                        type: "Link.document",
                                        value: this._getDocumentLink( doc.data[ i ].value[ j ][ type ].value.document, dict )
                                    });

                                } else {
                                    ret.data[ k ].value.push( doc.data[ i ].value[ j ][ type ] );
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
export default helpers;