/**
 *
 * Inlcude global stylesheet.
 *
 */
require( "../sass/screen.scss" );


import index from "./index";
import Socket from "./Socket";
import Scroller from "./Scroller";
import router from "./router";
import nav from "./menus/nav";
import * as core from "./core";
import intro from "./menus/intro";
import about from "./index/about";
import artist from "./index/artist";
import refine from "./index/refine";
import submit from "./menus/submit";
import feature from "./index/feature";
import features from "./index/features";
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
        // Modules
        this.nav = nav;
        this.core = core;
        this.intro = intro;
        this.index = index;
        this.about = about;
        this.submit = submit;
        this.refine = refine;
        this.router = router;
        this.artist = artist;
        this.feature = feature;
        this.features = features;
        this.templates = templates;

        // Scroll handling
        this.scroller = new Scroller( this.core.dom.page[ 0 ] );

        // Data handling
        this.data = {};
        this.socket = new Socket();

        // Intro splash screen
        this.intro.init();
        this.intro.update( 5 );

        // Open websocket server connection
        this.openConnection();
    }


    /**
     *
     * @public
     * @instance
     * @method openConnection
     * @memberof App
     * @description Open the websocket server connection.
     *
     */
    openConnection () {
        this.socket.connect(() => {
            core.log( "Socket connected." );

            this.socket.on( "index-stream", this.handleSocketStream.bind( this ) );
            this.socket.on( "index-complete", this.handleSocketComplete.bind( this ) );
        });
    }


    /**
     *
     * @public
     * @instance
     * @method handleSocketStream
     * @param {object} data The incoming socket data
     * @memberof App
     * @description Handle the incoming data stream.
     *
     */
    handleSocketStream ( data ) {
        core.log( "Socket data", data );

        if ( !this.data[ data.type ] ) {
            this.data[ data.type ] = data.value;

        } else {
            this.data[ data.type ] = this.data[ data.type ].concat( data.value );
        }

        this.intro.update( data.stat );
    }


    /**
     *
     * @public
     * @instance
     * @method handleSocketComplete
     * @memberof App
     * @description Handle the completion of the data stream.
     *
     */
    handleSocketComplete () {
        core.log( "Socket stream complete" );

        this.core.cache.set( "data", this.data );

        delete this.data;

        this.initModules();
        this.bindScroller();
    }


    /**
     *
     * @public
     * @instance
     * @method bindScroller
     * @memberof App
     * @description Bind events for page scrolling.
     *
     */
    bindScroller () {
        this.scroller.on( "scroll", () => {
            this.core.emitter.fire( "app--scroll", this.scroller.getScrollY() );
        });

        this.scroller.on( "scrollup", () => {
            this.core.emitter.fire( "app--scrollup", this.scroller.getScrollY() );
        });

        this.scroller.on( "scrolldown", () => {
            this.core.emitter.fire( "app--scrolldown", this.scroller.getScrollY() );
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
        this.submit.init();
        this.refine.init();
        this.templates.init();

        // Views
        this.index.init( this );
        this.about.init( this );
        this.artist.init( this );
        this.feature.init( this );
        this.features.init( this );

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
