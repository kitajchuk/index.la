import Vue from "vue";
import refine from "./refine";
import * as core from "../core";
import helpers from "./helpers";
import templates from "./templates";


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
     * @member dataType
     * @memberof index
     * @description The content type.
     *
     */
    dataType: "artist",


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
     * @param {object} data The loaded app data
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init ( data ) {
        this.data = data;

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
        this.viewData = {
            artists: helpers.getLinkedDocuments( this.dataType, this.data )
        };
        this.view = new Vue({
            el: core.dom.page[ 0 ],
            data: this.viewData,
            ready: () => {
                this.imageController = core.images.handleImages();
            },
            replace: false,
            template: templates.get( this.template )
        });

        refine.setData( this.viewData.artists );

        core.dom.html.addClass( "is-index-page" );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof index
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        if ( this.view ) {
            this.view.$destroy();
            this.view = null;
            this.viewData = null;
        }

        if ( this.imageController ) {
            this.imageController.destroy();
            this.imageController = null;
        }

        core.dom.html.removeClass( "is-index-page" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default index;
