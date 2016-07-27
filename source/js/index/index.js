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
     * @param {App} app The App Instance
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init ( app ) {
        this.app = app;

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
        const documents = router.getState( "artists" );

        if ( documents ) {
            this.view();

        } else {
            this.app.socket.get( "index-documents", { type: "artists" }, ( data ) => {
                router.setState( "artists", data, true );

                this.view();
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @memberof index
     * @description Method renders the view and sets refine data.
     *
     */
    view () {
        const documents = router.getState( "artists" );

        refine.setData( documents );
        router.setView( this.template, {
            artists: documents
        });
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
