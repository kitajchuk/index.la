import router from "../router";
import * as core from "../core";


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
     * @memberof feature
     * @description Method runs once when window loads.
     *
     */
    init () {
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
        const data = {
            feature: router.getState( "data" ).feature.find(( el ) => {
                return (el.slug === slug);
            })
        };

        router.setView( this.template, data );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof feature
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default feature;
