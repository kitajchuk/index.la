import $ from "properjs-hobo";
import * as core from "../core";


/**
 *
 * @description Filter, Search methods for datas
 * @namespace refine
 * @public
 *
 */
const refine = {
    /**
     *
     * @public
     * @method init
     * @memberof refine
     * @description Initialize the filter, search etc...
     *
     */
    init () {
        this.element = core.dom.body.find( ".js-refine" );
        this.trigger = core.dom.header.find( ".js-controller--refine" );
        this.filters = this.element.find( ".js-filter-option" );
        this.search = this.element.find( ".js-search-field" );
        this.sorts = this.element.find( ".js-sort-option" );
        this.isOpen = false;
        this.bind();
    },


    /**
     *
     * @public
     * @method setData
     * @param {object} data The data to refine with
     * @memberof refine
     * @description Set the data to work with
     *
     */
    setData ( data ) {
        this.data = data;
    },


    /**
     *
     * @public
     * @method resetSearch
     * @memberof refine
     * @description Clear search field
     *
     */
    resetSearch () {
        this.search[ 0 ].value = "";
    },


    /**
     *
     * @public
     * @method resetFilters
     * @memberof refine
     * @description Clear filter/sort fields
     *
     */
    resetFilters () {
        this.sorts.removeClass( "is-active" );
        this.filters.removeClass( "is-active" );
        this.showAll();
    },


    /**
     *
     * @public
     * @method resetScroll
     * @memberof refine
     * @description Reset the page scroll to top for index refinements
     *
     */
    resetScroll () {
        core.dom.page[ 0 ].scrollTop = 0;
    },


    /**
     *
     * @public
     * @method open
     * @memberof refine
     * @description Open the refine menu
     *
     */
    open () {
        this.isOpen = true;

        core.dom.html.addClass( "is-refine-open" );
        core.dom.page.on( "click", ( e ) => {
            e.preventDefault();

            this.close();
        });
    },


    /**
     *
     * @public
     * @method close
     * @memberof refine
     * @description Close the refine menu
     *
     */
    close () {
        this.isOpen = false;

        core.dom.html.removeClass( "is-refine-open" );
        core.dom.page.off( "click" );
    },


    /**
     *
     * @public
     * @method bind
     * @memberof refine
     * @description Initialize events
     *
     */
    bind () {
        this.trigger.on( "click", onRefineTrigger );
        this.element.on( "click", ".js-filter-option", onFilterOption );
        this.element.on( "click", ".js-sort-option", onSortOption );
        this.search.on( "keyup", onSearchKey );
        core.dom.doc.on( "keydown", onEscKeydown );
    },


    /**
     *
     * @public
     * @method showAll
     * @memberof refine
     * @description Ensure all documents are visible
     *
     */
    showAll () {
        if ( this.data ) {
            this.data.forEach(( element ) => {
                element.show = true;
            });
        }
    },


    /**
     *
     * @public
     * @method sortBy
     * @param {string} key The type of sort to perform
     * @memberof refine
     * @description Sort by a criteria
     *
     */
    sortBy ( key ) {
        this.processSort( key );
    },


    /**
     *
     * @public
     * @method filterBy
     * @param {array} filters The active filters to use
     * @memberof refine
     * @description Filter by a set of options
     *
     */
    filterBy ( filters ) {
        this.data.forEach(( element ) => {
            this.processFilters( filters, element );
        });
    },


    /**
     *
     * @public
     * @method searchBy
     * @param {string} value The keyword to search match
     * @memberof refine
     * @description Filter results by a keyword comparison to documents fields
     *
     */
    searchBy ( value ) {
        this.data.forEach(( element ) => {
            this.processKeyword( value, element );
        });
    },


    /**
     *
     * @public
     * @method processKeyword
     * @param {string} keyword The keyword match against
     * @param {object} element The document to look at
     * @memberof refine
     * @description Process a search keyword against a document for display
     *
     */
    processKeyword ( keyword, element ) {
        element.show = false;

        const regex = new RegExp( keyword, "i" );

        // Name
        if ( element.data.name && element.data.name.value.match( regex ) ) {
            element.show = true;
        }

        // Email
        if ( element.data.email && element.data.email.value.match( regex ) ) {
            element.show = true;
        }

        // Website
        if ( element.data.website && element.data.website.value.match( regex ) ) {
            element.show = true;
        }

        // Description
        if ( element.data.description ) {
            element.data.description.value.forEach(( block ) => {
                if ( block.text.match( regex ) ) {
                    element.show = true;
                }
            });
        }

        // City
        if ( element.data.city && element.data.city.value.data.name.value.match( regex ) ) {
            element.show = true;
        }

        // Region
        if ( element.data.region && element.data.region.value.data.name.value.match( regex ) ) {
            element.show = true;
        }

        // Types
        if ( element.data.types ) {
            element.data.types.value.forEach(( type ) => {
                if ( type.type.value.data.name.value.match( regex ) ) {
                    element.show = true;
                }
            });
        }

        // Categories
        if ( element.data.categories ) {
            element.data.categories.value.forEach(( category ) => {
                if ( category.category.value.data.name.value.match( regex ) ) {
                    element.show = true;
                }
            });
        }
    },


    /**
     *
     * @public
     * @method processFilters
     * @param {array} filters The filters to match against
     * @param {object} element The document to look at
     * @memberof refine
     * @description Process a document against filters for display
     *
     */
    processFilters ( filters, element ) {
        const needs = filters.length;
        let has = 0;

        element.show = false;

        filters.forEach(( filterSet ) => {
            if ( element.data[ filterSet.type ].type === "Group" ) {
                let i = element.data[ filterSet.type ].value.length;

                for ( i; i--; ) {
                    if ( element.data[ filterSet.type ].value[ i ][ filterSet.customType ].value.data.name.value === filterSet.value ) {
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
    },


    /**
     *
     * @public
     * @method processSort
     * @param {string} key The sorting order
     * @memberof refine
     * @description Process a documents against a sorting order
     *
     */
    processSort ( key ) {
        this.data.sort(( a, b ) => {
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
    }
};


const onRefineTrigger = function () {
    if ( refine.isOpen ) {
        refine.close();

    } else {
        refine.open();
    }
};


const onEscKeydown = function ( e ) {
    if ( e.keyCode === 27 && refine.isOpen ) {
        e.preventDefault();

        refine.close();
    }
};


const onSearchKey = function ( e ) {
    e.preventDefault();

    if ( e.keyCode === 13 ) {
        refine.close();

    } else {
        refine.resetFilters();
        refine.searchBy( this.value );
        refine.resetScroll();
    }
};


const onSortOption = function ( e ) {
    const $target = $( e.target );
    let value = $target.data( "value" );

    if ( $target.is( ".is-active" ) ) {
        value = "uuid";
        $target.removeClass( "is-active" );

    } else {
        refine.sorts.removeClass( "is-active" );
        $target.addClass( "is-active" );
    }

    refine.resetSearch();
    refine.sortBy( value );
    refine.resetScroll();
};


const onFilterOption = function ( e ) {
    const $target = $( e.target );
    const $filters = $target.parent().children();
    const filters = [];

    if ( $target.is( ".is-active" ) ) {
        $target.removeClass( "is-active" );

    } else {
        $filters.removeClass( "is-active" );
        $target.addClass( "is-active" );
    }

    refine.filters.filter( ".is-active" ).forEach(( node ) => {
        const nodeData = $( node ).data();

        filters.push( nodeData );
    });

    refine.resetSearch();
    refine.filterBy( filters );
    refine.resetScroll();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default refine;
