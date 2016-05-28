import * as core from "../core";
import helpers from "./helpers";
import Vue from "vue";
//import $ from "properjs-hobo";


/**
 *
 * @public
 * @namespace artist
 * @description A nice description of what this module does...
 *
 */
const artist = {
    dataType: "artist",
    domSelector: ".js-artist",


    /**
     *
     * @public
     * @method init
     * @memberof artist
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--data", this.ondata.bind( this ) );

        core.log( "artist initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof artist
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
     * @memberof artist
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        this.viewData = helpers.getLinkedDocument( this.dataType, this.element.data().id, this.data );
        this.view = new Vue({
            el: this.domSelector,
            data: this.viewData,
            ready: () => {
                this.imageController = core.images.handleImages( this.element.find( ".js-artist-image" ) );
            }
        });
    },


    /**
     *
     * @public
     * @method unload
     * @memberof artist
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
     * @memberof artist
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
     * @memberof artist
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        this.element = core.dom.page.find( ".js-artist" );

        return ( this.element.length );
    },


    ondata ( data ) {
        this.data = data;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default artist;