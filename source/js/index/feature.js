import Vue from "vue";
import * as core from "../core";
import helpers from "./helpers";
import templates from "./templates";


/**
 *
 * @public
 * @namespace feature
 * @description A nice description of what this module does...
 *
 */
const feature = {
    /**
     *
     * @public
     * @member dataType
     * @memberof feature
     * @description The content type.
     *
     */
    dataType: "feature",


    /**
     *
     * @public
     * @member template
     * @memberof feature
     * @description The template context.
     *
     */
    template: "feature",


    /**
     *
     * @public
     * @method init
     * @param {object} data The loaded app data
     * @memberof feature
     * @description Method runs once when window loads.
     *
     */
    init ( data ) {
        this.data = data;

        core.emitter.on( "app--view-feature", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "feature initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @param {string} slug The document slug
     * @memberof feature
     * @description Method performs onloading actions for this module.
     *
     */
    load ( slug ) {
        this.viewData = {
            page: helpers.getLinkedDocumentBySlug( this.dataType, slug, this.data )
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

        core.dom.html.addClass( "is-feature-page" );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof feature
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

        core.dom.html.removeClass( "is-feature-page" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default feature;
