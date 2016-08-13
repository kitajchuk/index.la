import refine from "./refine";
import router from "../router";
import * as core from "../core";


/**
 *
 * @public
 * @namespace index
 * @description A nice description of what this module does...
 *
 */
const index = {
    /**
     *
     * @public
     * @member isgridview
     * @memberof index
     * @description Flag on for `grid` view.
     *
     */
    isGridView: false,


    /**
     *
     * @public
     * @member template
     * @memberof index
     * @description The template context.
     *
     */
    template: "index",


    /**
     *
     * @public
     * @method init
     * @param {App} app The App Instance
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init ( app ) {
        this.app = app;
        this.gridIcon = core.dom.header.find( ".js-controller--grid" );

        this.gridIcon.on( "click", this.toggleView.bind( this ) );
        core.emitter.on( "app--view-index", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "index initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @memberof index
     * @description Method performs onloading actions for this module.
     *
     */
    load () {
        const documents = core.cache.get( "artists" );

        if ( documents ) {
            this.view();

        } else {
            this.app.socket.get( "index-documents", { type: "artists" }, ( data ) => {
                core.cache.set( "artists", data );

                this.view();
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @memberof index
     * @description Method renders the view and sets refine data.
     *
     */
    view () {
        const documents = core.cache.get( "artists" );

        this.viewData = {
            documents: documents,
            noresults: false,
            isgridview: this.isGridView
        };

        refine.setData( this.viewData );
        router.setView( this.template, this.viewData );
    },


    /**
     *
     * @public
     * @method toggleView
     * @memberof index
     * @description Toggle between list and grid views.
     *
     */
    toggleView () {
        this.isGridView = !this.isGridView;
        this.viewData.isgridview = this.isGridView;

        if ( this.viewData.isgridview ) {
            core.dom.html.addClass( "is-grid-view" );

        } else {
            core.dom.html.removeClass( "is-grid-view" );
        }
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof index
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default index;
