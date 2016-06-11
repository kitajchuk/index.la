import * as core from "../core";
import helpers from "./helpers";
import Vue from "vue";


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
     * @member domSelector
     * @memberof featured
     * @description The dom context.
     *
     */
    domSelector: ".js-featured",


    /**
     *
     * @public
     * @method init
     * @memberof featured
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--data", this.ondata.bind( this ) );

        core.log( "featured initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof featured
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof featured
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        this.viewData = {
            features: helpers.getLinkedDocuments( this.dataType, this.data )
        };
        this.view = new Vue({
            el: this.domSelector,
            data: this.viewData,
            ready: () => {
                this.imageController = core.images.handleImages( this.element.find( ".js-featured-image" ) );
            }
        });

        core.dom.html.addClass( "is-featured-page" );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof featured
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
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
        // Images?
        this.imageController.destroy();
        this.imageController = null;

        // Vue.js?
        this.view.$destroy();
        this.view = null;
        this.viewData = null;

        // Element?
        this.element = null;

        core.dom.html.removeClass( "is-featured-page" );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof featured
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        this.element = core.dom.page.find( ".js-featured" );

        return ( this.element.length );
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
