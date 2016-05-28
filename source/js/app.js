/**
 *
 * Inlcude global stylesheet.
 *
 */
require( "../sass/screen.scss" );


import $ from "properjs-hobo";
import router from "./router";
import nav from "./menus/nav";
import * as core from "./core";
import drags from "./drags";
import intro from "./menus/intro";


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        this.nav = nav;
        this.core = core;
        this.router = router;
        this.intro = intro;

        this.loadData().then(( data ) => {
            this.initModules();
            this.initScrolling();

            this.core.emitter.fire( "app--data", data );

            this.intro.teardown();
        });
    }


    loadData () {
        return $.ajax({
            url: "/api/data.json",
            dataType: "json"
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
        this.core.detect.init( this );
        this.router.init( this );
        this.nav.init( this );

        this.analytics = new this.core.Analytics();
    }


    /**
     *
     * @public
     * @instance
     * @method initScrolling
     * @memberof App
     * @description Initialize the appropriate scroll manager.
     *
     */
    initScrolling () {
        // Use Greensock Draggable for devices
        if ( this.core.detect.isDevice() ) {
            this.scrollManager = drags;

        // Use ProperJS ScrollController for laptops, etc...
        } else {
            this.scrollManager = core.scrolls;
        }

        this.scrollManager.init( this );
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