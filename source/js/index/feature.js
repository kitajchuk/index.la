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
     * @param {string} uri The document uri
     * @memberof feature
     * @description Method performs onloading actions for this module.
     *
     */
    load ( uri ) {
        const documents = core.cache.get( "features" );

        if ( documents ) {
            this.view( uri );

        } else {
            this.app.socket.get( "index-documents", { type: "features" }, ( data ) => {
                core.cache.set( "features", data );

                this.view( uri );
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @param {string} uri The uri slug
     * @memberof feature
     * @description Method renders the view.
     *
     */
    view ( uri ) {
        const documents = core.cache.get( "features" ).sort( core.util.sortByTimestamp );
        const featureDoc = documents.find(( el ) => {
            return (el.uri === uri);
        });
        const nextDoc = documents[ documents.indexOf( featureDoc ) + 1 ];

        router.setView( this.template, {
            feature: featureDoc,
            next: nextDoc
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
