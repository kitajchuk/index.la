import * as core from "../core";
import helpers from "./helpers";
import filter from "./filter";
import Vue from "vue";


/**
 *
 * @public
 * @namespace index
 * @description A nice description of what this module does...
 *
 */
const index = {
    dataType: "artist",
    domSelector: ".js-index",


    /**
     *
     * @public
     * @method init
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init () {
        filter.init();

        core.emitter.on( "app--data", this.ondata.bind( this ) );

        core.log( "index initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof index
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
     * @memberof index
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        this.viewData = {
            artists: helpers.getLinkedDocuments( this.dataType, this.data )
        };
        this.view = new Vue({
            el: this.domSelector,
            data: this.viewData,
            ready: () => {
                this.imageController = core.images.handleImages( this.element.find( ".js-index-image" ) );
            }
        });

        filter.setData( this.viewData.artists );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof index
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
     * @memberof index
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
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof index
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        this.element = core.dom.page.find( ".js-index" );

        return ( this.element.length );
    },


    ondata ( data ) {
        this.data = data;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default index;