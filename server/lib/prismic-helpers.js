/**
 *
 * @description Helper methods for prismic.io datas
 * @namespace helpers
 * @public
 *
 */
var helpers = {
    uuid: 0,


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
     * @method _getDocumentGroup
     * @param {object} docData data for a document
     * @param {array} dict The array of documents to look in
     * @memberof helpers
     * @description Get the references for a `Group`
     * @returns {object}
     *
     */
    _getDocumentGroup ( docData, dict ) {
        var elem = null;
        var keys = null;
        var ret = {
            type: "Group",
            value: []
        };

        docData.value.forEach(function ( value ) {
            keys = Object.keys( value );
            elem = null;

            keys.forEach(function ( type ) {
                elem = elem || {};

                if ( !value[ type ].value.isBroken ) {
                    if ( value[ type ].type === "Link.document" ) {
                        elem[ type ] = {
                            type: "Link.document",
                            value: helpers._getDocumentLink( value[ type ].value.document, dict )
                        };

                    } else {
                        elem[ type ] = value[ type ];
                    }

                } else {
                    elem = null;
                }
            });

            if ( elem !== null ) {
                ret.value.push( elem );
            }
        });

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
        var key = null;
        var ret = {
            id: doc.id,
            slug: doc.slugs.find(function ( slug ) {
                return !/^\d/.test( slug );
            }),
            type: doc.type,
            tags: doc.tags,
            data: {},
            show: true,
            uuid: this.uuid++
        };

        for ( i in doc.data ) {
            if ( doc.data.hasOwnProperty( i ) ) {
                key = i.replace( doc.type + ".", "" );

                // Skip linked document without dict references
                if ( doc.data[ i ].type === "Link.document" && !dict[ doc.data[ i ].value.document.type ] ) {
                    ret.data[ key ] = doc.data[ i ];

                // Skip broken document links
                } else if ( doc.data[ i ].type === "Link.document" && !doc.data[ i ].value.isBroken ) {
                    ret.data[ key ] = {
                        type: "Link.document",
                        value: this._getDocumentLink( doc.data[ i ].value.document, dict )
                    };

                } else if ( doc.data[ i ].type === "Group" ) {
                    ret.data[ key ] = this._getDocumentGroup( doc.data[ i ], dict );

                } else {
                    ret.data[ key ] = doc.data[ i ];
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
