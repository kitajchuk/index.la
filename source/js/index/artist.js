import * as core from "../core";
import helpers from "./helpers";
import refine from "./refine";
import Vue from "vue";


/**
 *
 * @public
 * @namespace artist
 * @description A nice description of what this module does...
 *
 */
const artist = {
    /**
     *
     * @public
     * @member dataType
     * @memberof artist
     * @description The content type.
     *
     */
    dataType: "artist",


    /**
     *
     * @public
     * @member domSelector
     * @memberof artist
     * @description The dom context.
     *
     */
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

        refine.resetSearch();
        refine.resetFilters();

        core.dom.html.addClass( "is-artist-page" );
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

        core.dom.html.removeClass( "is-artist-page" );
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


    /**
     *
     * @public
     * @method ondata
     * @param {object} data The app data
     * @memberof artist
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
export default artist;