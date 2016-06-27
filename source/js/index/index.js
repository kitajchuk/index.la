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
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init () {
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
        const data = {
            artists: router.getState( "data" ).artist
        };

        router.setView( this.template, data );
        refine.setData( data.artists );
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
