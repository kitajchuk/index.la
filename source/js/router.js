import nav from "./menus/nav";
import * as core from "./core";
import refine from "./index/refine";
import PageController from "properjs-pagecontroller";


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
            transitionTime: this.pageDuration,
            routerOptions: {
                async: false
            }
        });

        this.controller.setConfig([
            "/",
            ":view",
            ":view/:id"
        ]);

        this.controller.on( "page-controller-router-samepage", () => nav.close() );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", this.viewChange.bind( this ) );

        this.controller.initPage();
    },


    /**
     *
     * @public
     * @method viewChange
     * @param {object} data The PageController data object
     * @memberof router
     * @description Handle view changes.
     *
     */
    viewChange ( data ) {
        const view = (data.request.params.view || "index");
        const args = (data.request.params.id || null);

        core.emitter.fire( `app--view-${view}`, args );
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

        setTimeout( () => {
            nav.close();
            refine.close();

            core.dom.page[ 0 ].scrollTop = 0;

            core.emitter.fire( "app--view-teardown" );

        }, this.pageDuration );
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
        this.viewChange( data );

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
    changePageIn ( /* data */ ) {
        nav.toggleActive();

        core.util.disableMouseWheel( false );
        core.util.disableTouchMove( false );

        core.dom.html.removeClass( "is-routing" );
        core.dom.page.removeClass( "is-inactive" );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
