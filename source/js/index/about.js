import router from "../router";
import * as core from "../core";


/**
 *
 * @public
 * @namespace about
 * @description A nice description of what this module does...
 *
 */
const about = {
    /**
     *
     * @public
     * @member template
     * @memberof about
     * @description The template context.
     *
     */
    template: "about",


    /**
     *
     * @public
     * @method init
     * @memberof about
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--view-about", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "about initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @memberof about
     * @description Method performs onloading actions for this module.
     *
     */
    load () {
        const data = core.cache.get( "data" );

        router.setView( this.template, {
            meta: data.meta[ 0 ],
            socials: data.social
        });
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof about
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default about;
