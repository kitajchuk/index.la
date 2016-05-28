/**
 *
 * @description Filter methods for datas
 * @member filter
 * @memberof filter
 *
 */
const filter = {
    by ( filters, data ) {
        this.shows = (filters.length ? [] : data);

        filters.forEach(( filterSet ) => {
            this.process( filterSet, data );
        });

        this.shows.forEach(( element ) => {
            element.show = true;
        });
    },


    process ( filters, data ) {
        data.forEach(( element ) => {
            element.show = false;

            if ( element.data[ filters.type ].type === "Group" ) {
                let i = element.data[ filters.type ].value.length;

                for ( i; i--; ) {
                    if ( element.data[ filters.type ].value[ i ].value.data.name.value === filters.value ) {
                        this.shows.push( element );
                        break;
                    }
                }

            } else if ( element.data[ filters.type ].type === "Link.document" ) {
                if ( element.data[ filters.type ].value.data.name.value === filters.value ) {
                    this.shows.push( element );
                }

            } else if ( element.data[ filters.type ].value === filters.value ) {
                this.shows.push( element );
            }
        });
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default filter;