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
     * @param {App} app The App Instance
     * @memberof feature
     * @description Method runs once when window loads.
     *
     */
    init ( app ) {
        this.app = app;

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
        const documents = router.getState( "features" );

        if ( documents ) {
            this.view( slug );

        } else {
            this.app.socket.get( "index-documents", { type: "features" }, ( data ) => {
                router.setState( "features", data, true );

                this.view( slug );
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @param {string} slug The uri slug
     * @memberof feature
     * @description Method renders the view.
     *
     */
    view ( slug ) {
        const documents = router.getState( "features" );

        router.setView( this.template, {
            feature: documents.find(( el ) => {
                return (el.slug === slug);
            })
        });
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
