import * as core from "../core";
import $ from "properjs-hobo";
import Menu from "../menus/Menu";


/**
 *
 * @description Filter methods for datas
 * @member filter
 * @memberof filter
 *
 */
const filter = {
    init () {
        this.element = core.dom.body.find( ".js-filter" );
        this.trigger = core.dom.header.find( ".js-controller--filter" );
        this.filters = this.element.find( ".js-filter-option" );
        this.sorts = this.element.find( ".js-sort-option" );
        this.menu = new Menu( this.element );
        this.bind();
    },


    setData ( data ) {
        this.data = data;
    },


    open () {
        this.menu.open();
    },


    close () {
        this.menu.close();
    },


    bind () {
        this.element.on( "click", onTapFilterMenu );
        this.trigger.on( "click", onTapFilterIcon );

        this.element.on( "click", ".js-filter-option", ( e ) => {
            const $target = $( e.target );
            const $filters = $target.parent().children();
            const filters = [];

            if ( $target.is( ".is-active" ) ) {
                $target.removeClass( "is-active" );

            } else {
                $filters.removeClass( "is-active" );
                $target.addClass( "is-active" );
            }

            this.filters.filter( ".is-active" ).forEach(( node ) => {
                const nodeData = $( node ).data();

                filters.push( nodeData );
            });

            this.filterBy( filters, this.data );
        });

        this.element.on( "click", ".js-sort-option", ( e ) => {
            const $target = $( e.target );
            let value = $target.data( "value" );

            if ( $target.is( ".is-active" ) ) {
                value = "uuid";
                $target.removeClass( "is-active" );

            } else {
                this.sorts.removeClass( "is-active" );
                $target.addClass( "is-active" );
            }

            this.sortBy( value, this.data );
        });
    },


    sortBy ( key, data ) {
        data.sort(( a, b ) => {
            let ret = 0;

            a = (a[ key ] !== undefined ? a[ key ] : typeof a.data[ key ].value === "object" ? a.data[ key ].value.data.name.value : a.data[ key ].value);
            b = (b[ key ] !== undefined ? b[ key ] : typeof b.data[ key ].value === "object" ? b.data[ key ].value.data.name.value : b.data[ key ].value);

            if ( a < b ) {
                ret = -1;

            } else {
                ret = 1;
            }

            return ret;
        });
    },


    filterBy ( filters, data ) {
        data.forEach(( element ) => {
            this.process( filters, element );
        });
    },


    process ( filters, element ) {
        const needs = filters.length;
        let has = 0;

        element.show = false;

        filters.forEach(( filterSet ) => {
            if ( element.data[ filterSet.type ].type === "Group" ) {
                let i = element.data[ filterSet.type ].value.length;

                for ( i; i--; ) {
                    if ( element.data[ filterSet.type ].value[ i ].value.data.name.value === filterSet.value ) {
                        has++;
                        break;
                    }
                }

            } else if ( element.data[ filterSet.type ].type === "Link.document" ) {
                if ( element.data[ filterSet.type ].value.data.name.value === filterSet.value ) {
                    has++;
                }

            } else if ( element.data[ filterSet.type ].value === filterSet.value ) {
                has++;
            }
        });

        if ( has === needs ) {
            element.show = true;
        }
    }
};



const onTapFilterMenu = function ( e ) {
    const $target = $( e.target );

    if ( $target.is( ".js-filter" ) ) {
        filter.close();
    }
};


const onTapFilterIcon = function () {
    filter.open();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default filter;