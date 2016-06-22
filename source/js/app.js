/**
 *
 * Inlcude global stylesheet.
 *
 */
require( "../sass/screen.scss" );


import index from "./index";
import $ from "properjs-hobo";
import router from "./router";
import nav from "./menus/nav";
import * as core from "./core";
import intro from "./menus/intro";
import artist from "./index/artist";
import refine from "./index/refine";
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
        this.nav = nav;
        this.core = core;
        this.intro = intro;
        this.index = index;
        this.refine = refine;
        this.router = router;
        this.artist = artist;
        this.featured = featured;
        this.templates = templates;

        this.loadData().then(( data ) => {
            this.initModules( data );
            this.postModules();
        });
    }


    /**
     *
     * @public
     * @instance
     * @method loadData
     * @memberof App
     * @description Load the static site datas.
     * @returns {Promise}
     *
     */
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
     * @param {object} data The loaded app data
     * @memberof App
     * @description Initialize application modules.
     *
     */
    initModules ( data ) {
        // Core
        this.core.detect.init();

        // Utility
        this.nav.init();
        this.refine.init();
        this.templates.init();

        // Views
        this.index.init( data );
        this.artist.init( data );
        this.featured.init( data );
        //this.about.init( data );
        //this.feature.init( data );
    }


    postModules () {
        // Controller
        this.router.init();

        // Analytics
        this.analytics = new this.core.Analytics();

        // Remove splash
        this.intro.teardown();
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
