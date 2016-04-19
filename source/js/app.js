import router from "./router";
import nav from "./menus/nav";
import drags from "./drags";
import * as core from "./core";
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
        this.core = core;
        this.nav = nav;
        this.drags = drags;
        this.intro = intro;
        this.router = router;

        this.initEvents();
        this.initModules();
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
        //this.core.resizes.init( this );
        this.nav.init( this );
        this.router.init( this );
        this.analytics = new this.core.Analytics();
    }


    /**
     *
     * @public
     * @instance
     * @method initEvents
     * @memberof App
     * @description Initialize application events.
     *
     */
    initEvents () {
        this._onPreloadDone = this.onPreloadDone.bind( this );

        this.core.emitter.on( "app--preload-done", this._onPreloadDone );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreloadDone
     * @memberof App
     * @description Handle the event for initializing the app.
     *
     */
    onPreloadDone () {
        this.core.emitter.off( "app--preload-done", this._onPreloadDone );

        this.intro.teardown();

        // Use Greensock Draggable for devices
        if ( this.core.detect.isDevice() ) {
            this.scrollManager = this.drags;

        // Use ProperJS ScrollController for laptops, etc...
        } else {
            this.scrollManager = this.core.scrolls;
        }

        this.scrollManager.init( this );
    }
}


/******************************************************************************
 * Expose
*******************************************************************************/
window.app = new App();