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
        this.url = "http://node.theindex.la";
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

        this.intro.init();

        this.loadData().then(( data ) => {
            debugger;
            this.initModules();
            this.postModules( data );
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
            url: this.url,
            data: {},
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
    }


    /**
     *
     * @public
     * @instance
     * @method postModules
     * @param {object} data The loaded app data
     * @memberof App
     * @description Initialize core modules.
     *
     */
    postModules ( data ) {
        // Controller
        this.router.setState( "data", data.results, true );
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
