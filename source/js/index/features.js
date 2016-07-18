import router from "../router";
import * as core from "../core";


/**
 *
 * @public
 * @namespace features
 * @description A nice description of what this module does...
 *
 */
const features = {
    /**
     *
     * @public
     * @member template
     * @memberof features
     * @description The template context.
     *
     */
    template: "features",


    /**
     *
     * @public
     * @method init
     * @memberof features
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--view-features", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "features initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @memberof features
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
     * @memberof features
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default features;
