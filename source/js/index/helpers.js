let uuid = 0;


/**
 *
 * @description Helper methods for datas
 * @member helpers
 * @memberof helpers
 *
 */
const helpers = {
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


    getLinkedDocuments ( key, dict ) {
        const ret = [];
        const data = JSON.parse( JSON.stringify( dict ) );

        data[ key ].forEach(( doc ) => {
            ret.push( this._getDocumentWithLinks( doc, data ) );
        });

        return ret;
    },


    getDocumentLink ( link, dict ) {
        let i = dict[ link.type ].length;
        let ret = null;

        for ( i; i--; ) {
            if ( dict[ link.type ][ i ].id === link.id ) {
                ret = dict[ link.type ][ i ];
                break;
            }
        }

        ret.data = this.cleanDataKeys( ret.data );

        return ret;
    },


    cleanDataKeys ( data ) {
        let i = null;
        const ret = {};

        for ( i in data ) {
            if ( data.hasOwnProperty( i ) ) {
                ret[ i.replace( /^.*?\./, "" ) ] = data[ i ];
            }
        }

        return ret;
    },


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
                        value: this.getDocumentLink( doc.data[ i ].value.document, dict )
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
                                        value: this.getDocumentLink( doc.data[ i ].value[ j ][ type ].value.document, dict )
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