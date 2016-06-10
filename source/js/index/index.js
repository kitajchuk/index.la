import * as core from "../core";
import helpers from "./helpers";
import refine from "./refine";
import Vue from "vue";


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
     * @member domSelector
     * @memberof index
     * @description The dom context.
     *
     */
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
        refine.init();

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

        refine.setData( this.viewData.artists );

        core.dom.html.addClass( "is-index-page" );
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

        core.dom.html.removeClass( "is-index-page" );
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


    /**
     *
     * @public
     * @method ondata
     * @param {object} data The app data
     * @memberof index
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
export default index;