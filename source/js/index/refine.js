import $ from "properjs-hobo";
import * as core from "../core";
import Vue from "vue";
import paramalama from "paramalama";


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
        this.label = core.dom.body.find( ".js-refine-label" );
        this.trigger = core.dom.header.find( ".js-controller--refine" );
        this.isOpen = false;
        this.initView();
    },


    /**
     *
     * @public
     * @method initView
     * @memberof refine
     * @description Render the refine view.
     *
     */
    initView () {
        const data = core.cache.get( "data" );

        this.viewMenu = new Vue({
            el: this.element[ 0 ],
            data: {
                sorts: data.sort,
                types: data.type,
                regions: data.region,
                categories: data.category
            },
            replace: false,
            compiled: () => {
                this.filters = this.element.find( ".js-filter-option" );
                this.search = this.element.find( ".js-search-field" );
                this.sorts = this.element.find( ".js-sort-option" );
                this.active = {
                    sort: this.sorts.eq( 0 ).data(),
                    label: "",
                    search: null,
                    filters: null
                };
                this.bindEvents();
            }
        });

        this.viewLabel = new Vue({
            el: this.label[ 0 ],
            data: this.active,
            replace: false
        });
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
        this.applyState();
    },


    /**
     *
     * @public
     * @method applyState
     * @memberof refine
     * @description Apply the saved refinement state
     *
     */
    applyState () {
        const params = paramalama( window.location.search );

        if ( params && params.type && params.customType && params.value ) {
            this.resetSearch();
            this.resetFilters();
            this.resetScroll();
            this.filterBy( [params] );
            this.applyLabel();
            this.applyNone();

            this.filters.filter( `[data-value='${params.value}']` ).addClass( "is-active" );

        } else {
            if ( this.active.sort ) {
                this.sortBy( this.active.sort );
            }

            if ( this.active.filters ) {
                this.filterBy( this.active.filters );
            }

            if ( this.active.search ) {
                this.search[ 0 ].value = this.active.search;
                this.searchBy( this.active.search );
            }
        }
    },


    /**
     *
     * @public
     * @method applyLabel
     * @memberof refine
     * @description Set the visual label for refinement selections
     *
     */
    applyLabel () {
        const label = [];

        if ( this.active.filters ) {
            this.active.filters.forEach(( filterSet ) => {
                label.push( filterSet.value );
            });

        } else if ( this.active.search ) {
            label.push( this.active.search );
        }

        this.active.label = label.join( " / " );
    },


    /**
     *
     * @public
     * @method applyNone
     * @memberof refine
     * @description Handle the NO results
     *
     */
    applyNone () {
        let shown = 0;

        this.data.noresults = false;

        this.data.documents.forEach(( element ) => {
            if ( element.show ) {
                shown++;
            }
        });

        if ( !shown ) {
            this.data.noresults = true;
        }
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
        this.active.search = null;
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
        this.filters.removeClass( "is-active" );
        this.active.filters = null;
        this.active.sort = this.sorts.eq( 0 ).data();
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
        this.search[ 0 ].focus();

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
     * @method bindEvents
     * @memberof refine
     * @description Initialize events
     *
     */
    bindEvents () {
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
            this.data.documents.forEach(( element ) => {
                element.show = true;
            });
        }
    },


    /**
     *
     * @public
     * @method sortBy
     * @param {object} data The sort label and value
     * @memberof refine
     * @description Sort by a criteria
     *
     */
    sortBy ( data ) {
        this.processSort( data );
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
        this.data.documents.forEach(( element ) => {
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
        this.data.documents.forEach(( element ) => {
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

        const regex = new RegExp( keyword, "gi" );

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

        // Tags
        if ( element.tags ) {
            element.tags.forEach(( tag ) => {
                if ( tag.match( regex ) ) {
                    element.show = true;
                }
            });
        }

        this.active.search = keyword;
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

        this.active.filters = filters;

        if ( has === needs ) {
            element.show = true;
        }
    },


    /**
     *
     * @public
     * @method processSort
     * @param {object} data The sort label and value
     * @memberof refine
     * @description Process a documents against a sorting order
     *
     */
    processSort ( data ) {
        this.active.sort = data;

        this.data.documents.sort(( a, b ) => {
            let ret = 0;
            let cond = null;

            a = (a[ data.value ] !== undefined ? a[ data.value ] : typeof a.data[ data.value ].value === "object" ? a.data[ data.value ].value.data.name.value : a.data[ data.value ].value);
            b = (b[ data.value ] !== undefined ? b[ data.value ] : typeof b.data[ data.value ].value === "object" ? b.data[ data.value ].value.data.name.value : b.data[ data.value ].value);

            if ( data.order === "desc" ) {
                cond = (a > b);

            } else {
                cond = (a < b);
            }

            if ( cond ) {
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
        refine.applyLabel();
        refine.applyNone();
    }
};


const onSortOption = function ( e ) {
    const $target = $( e.target );
    const data = $target.data();

    if ( !$target.is( ".is-active" ) ) {
        refine.sorts.removeClass( "is-active" );
        $target.addClass( "is-active" );

        refine.sortBy( data );
        refine.resetScroll();
        refine.applyLabel();
        refine.applyNone();
    }
};


const onFilterOption = function ( e ) {
    const $target = $( e.target );
    const filters = [];

    if ( $target.is( ".is-active" ) ) {
        $target.removeClass( "is-active" );

    } else {
        $target.addClass( "is-active" );
    }

    refine.filters.filter( ".is-active" ).forEach(( node ) => {
        const nodeData = $( node ).data();

        filters.push( nodeData );
    });

    refine.resetSearch();
    refine.filterBy( filters );
    refine.resetScroll();
    refine.applyLabel();
    refine.applyNone();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default refine;
