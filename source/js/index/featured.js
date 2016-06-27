import router from "../router";
import * as core from "../core";


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
     * @memberof featured
     * @description Method runs once when window loads.
     *
     */
    init () {
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
        const data = {
            features: router.getState( "data" ).feature
        };

        router.setView( this.template, data );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof featured
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default featured;
