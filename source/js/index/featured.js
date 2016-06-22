import Vue from "vue";
import * as core from "../core";
import helpers from "./helpers";
import templates from "./templates";


/**
 *
 * @public
 * @namespace featured
 * @description A nice description of what this module does...
 *
 */
const featured = {
    /**
     *
     * @public
     * @member dataType
     * @memberof featured
     * @description The content type.
     *
     */
    dataType: "feature",


    /**
     *
     * @public
     * @member template
     * @memberof featured
     * @description The template context.
     *
     */
    template: "featured",


    /**
     *
     * @public
     * @method init
     * @param {object} data The loaded app data
     * @memberof featured
     * @description Method runs once when window loads.
     *
     */
    init ( data ) {
        this.data = data;

        core.emitter.on( "app--view-featured", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "featured initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @memberof featured
     * @description Method performs onloading actions for this module.
     *
     */
    load () {
        this.viewData = {
            features: helpers.getLinkedDocuments( this.dataType, this.data )
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

        core.dom.html.addClass( "is-featured-page" );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof featured
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

        core.dom.html.removeClass( "is-featured-page" );
    },


    /**
     *
     * @public
     * @method ondata
     * @param {object} data The app data
     * @memberof featured
     * @description Listen for the app datas.
     *
     */
    ondata ( data ) {
        this.data = data;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default featured;
