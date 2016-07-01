/**
 *
 * Inlcude global stylesheet.
 *
 */
require( "../sass/screen.scss" );


import index from "./index";
import Socket from "./Socket";
//import $ from "properjs-hobo";
import router from "./router";
import nav from "./menus/nav";
import * as core from "./core";
import intro from "./menus/intro";
import about from "./index/about";
import artist from "./index/artist";
import refine from "./index/refine";
import feature from "./index/feature";
import featured from "./index/featured";
import templates from "./index/templates";


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        this.url = (core.env.isDev() ? "http://localhost:8000" : "http://node.theindex.la");
        this.nav = nav;
        this.core = core;
        this.intro = intro;
        this.index = index;
        this.about = about;
        this.refine = refine;
        this.router = router;
        this.artist = artist;
        this.feature = feature;
        this.featured = featured;
        this.templates = templates;

        // Intro splash screen
        this.intro.init();
        this.intro.update( 5 );

        // Initial empty data state
        this.router.setState( "data", {}, true );

        // Open websocket server connection
        this.socket = new Socket();
        this.socket.connect(() => {
            core.log( "Socket connected." );

            this.socket.on( "index-data", ( data ) => {
                core.log( "Socket data", data );

                const rData = router.getState( "data" );

                if ( !rData[ data.type ] ) {
                    rData[ data.type ] = data.value;

                } else {
                    rData[ data.type ] = rData[ data.type ].concat( data.value );
                }

                this.intro.update( data.stat );
                this.router.setState( "data", rData, true );
            });

            this.socket.on( "index-done", () => {
                this.initModules();
            });
        });
    }


    /**
     *
     * @public
     * @instance
     * @method initModules
     * @memberof App
     * @description Initialize application modules.
     *
     */
    initModules () {
        // Core
        this.core.detect.init();

        // Utility
        this.nav.init();
        this.refine.init();
        this.templates.init();

        // Views
        this.index.init();
        this.about.init();
        this.artist.init();
        this.feature.init();
        this.featured.init();

        // Controller
        this.router.init();

        // Analytics
        this.analytics = new this.core.Analytics();
    }
}


/******************************************************************************
 * Expose
*******************************************************************************/
window.app = new App();


/******************************************************************************
 * Export
*******************************************************************************/
export default window.app;
