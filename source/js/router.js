import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import * as core from "./core";
import nav from "./menus/nav";
import animate from "./animate";
import index from "./index";
import artist from "./index/artist";


/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.state = {};
        this.status = 200;
        this.pageDuration = core.util.getTransitionDuration( core.dom.page[ 0 ] );
        this.bindEmptyHashLinks();
        this.initPageController();

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method initPageController
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPageController () {
        this.controller = new PageController({
            transitionTime: this.pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            core.images,

            index,
            artist,
            animate
        ]);

        this.controller.on( "page-controller-router-samepage", () => nav.close() );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", this.initPage.bind( this ) );

        this.controller.initPage();
    },


    /**
     *
     * @public
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( data ) {
        this.status = data.status;

        if ( this.status === 404 ) {
            this.handle404();
        }
    },


    /**
     *
     * @public
     * @method handle404
     * @memberof router
     * @description Handle `Page Not Found` for Router.
     *
     */
    handle404 () {
        // Handle 404s here...
    },


    /**
     *
     * @public
     * @method setState
     * @memberof router
     * @param {string} name The access key
     * @param {mixed} value The storage value
     * @description Non-persistent state.
     *              This state object will persist for one router cycle.
     *              The next router cycle will delete this state object.
     *
     */
    setState ( name, value ) {
        this.state[ name ] = {
            checked: false,
            name,
            value
        };
    },


    /**
     *
     * @public
     * @method getState
     * @memberof router
     * @param {string} name The access key
     * @description Access a state object ref by its name.
     * @returns {mixed}
     *
     */
    getState ( name ) {
        let id = null;
        let ret = null;

        for ( id in this.state ) {
            if ( this.state.hasOwnProperty( id ) ) {
                if ( this.state[ id ].name === name ) {
                    ret = this.state[ id ].value;
                    break;
                }
            }
        }

        return ret;
    },


    /**
     *
     * @public
     * @method checkState
     * @memberof router
     * @description Process state objects.
     *              Objects that have already been `checked` are deleted.
     *
     */
    checkState () {
        let id = null;

        for ( id in this.state ) {
            if ( this.state.hasOwnProperty( id ) ) {
                if ( this.state[ id ].checked ) {
                    delete this.state[ id ];

                } else {
                    this.state[ id ].checked = true;
                }
            }
        }
    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page. [Reference]{@link https://github.com/ProperJS/Router/blob/master/Router.js#L222}
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @param {function} cb Optional callback to fire
     * @memberof router
     * @description Trigger a silent route with a supplied callback.
     *
     */
    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
        this.checkState();
    },


    /**
     *
     * @public
     * @method parseDoc
     * @param {string} html The responseText to parse out
     * @memberof router
     * @description Get the DOM information to cache for a request.
     * @returns {object}
     *
     */
    parseDoc ( html ) {
        let doc = document.createElement( "html" );

        doc.innerHTML = html;

        doc = $( doc );

        return {
            $doc: doc,
            $page: doc.find( ".js-page" ),
            pageHtml: doc.find( ".js-page" )[ 0 ].innerHTML
        };
    },


    /**
     *
     * @public
     * @method bindEmptyHashLinks
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmptyHashLinks () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    /**
     *
     * @public
     * @method onPreloadDone
     * @memberof router
     * @description Finish routing sequence when image pre-loading is done.
     *
     */
    onPreloadDone () {
        core.util.disableMouseWheel( false );
        core.util.disableTouchMove( false );

        core.dom.html.removeClass( "is-routing" );
        core.dom.page.removeClass( "is-inactive" );

        core.scrolls.topout( 0 );
        core.scrolls.clearStates();

        setTimeout( () => core.emitter.fire( "app--intro-art" ), this.pageDuration );

        core.emitter.off( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method changePageOut
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut () {
        core.util.disableMouseWheel( true );
        core.util.disableTouchMove( true );

        core.dom.html.addClass( "is-routing" );
        core.dom.page.addClass( "is-inactive" );

        setTimeout( () => nav.close(), this.pageDuration );

        core.emitter.on( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method changeContent
     * @param {object} data The PageController data object
     * @memberof router
     * @description Swap the new content into the DOM.
     *
     */
    changeContent ( data ) {
        this.status = data.status;

        if ( this.status === 404 ) {
            this.handle404();

        } else {
            const doc = this.parseDoc( data.response );

            core.dom.page[ 0 ].innerHTML = doc.pageHtml;

            core.emitter.fire( "app--analytics-push", doc.$doc );
        }

        // Check state before cycle finishes so `checked` state can be deleted
        this.checkState();
    },


    /**
     *
     * @public
     * @method changePageIn
     * @param {object} data The data object supplied by PageController from PushState
     * @memberof router
     * @description Trigger transition-in animation.
     *
     */
    changePageIn ( data ) {
        const collection = data.request.uri.split( "/" )[ 0 ];

        nav.toggleActive( collection );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;