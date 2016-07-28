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
     * @param {App} app The App Instance
     * @memberof features
     * @description Method runs once when window loads.
     *
     */
    init ( app ) {
        this.app = app;

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
        const documents = core.cache.get( "features" );

        if ( documents ) {
            this.view();

        } else {
            this.app.socket.get( "index-documents", { type: "features" }, ( data ) => {
                core.cache.set( "features", data );

                this.view();
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @memberof features
     * @description Method renders the view and sets refine data.
     *
     */
    view () {
        const documents = core.cache.get( "features" );

        router.setView( this.template, {
            features: documents
        });
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
