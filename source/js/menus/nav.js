import $ from "properjs-hobo";
import * as core from "../core";
import Menu from "./Menu";


/**
 *
 * @public
 * @namespace nav
 * @description Handles opening / closing the main nav menu.
 * @memberof menus
 *
 */
const nav = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.nav
     * @description Initializes navmenu interactions.
     *
     */
    init () {
        this.element = core.dom.body.find( ".js-nav" );
        this.trigger = core.dom.header.find( ".js-controller--nav" );
        this.items = this.element.find( ".js-nav-item" );
        this.menu = new Menu( this.element );
        this.bind();
        this.toggleActive();

        core.log( "nav initialized" );
    },


    /**
     *
     * @public
     * @method open
     * @memberof menus.nav
     * @description Opens the navmenu.
     *
     */
    open () {
        this.menu.open();
    },


    /**
     *
     * @public
     * @method close
     * @memberof menus.nav
     * @description Closes the navmenu.
     *
     */
    close () {
        this.menu.close();
    },


    /**
     *
     * @public
     * @method bind
     * @memberof menus.nav
     * @description Setup main interaction events for nav/header.
     *
     */
    bind () {
        this.element.on( "click", onTapNavMenu );
        this.trigger.on( "click", onTapNavIcon );
    },


    /**
     *
     * @public
     * @method toggleActive
     * @memberof menus.nav
     * @description Toggle the active nav menu item by id.
     *
     */
    toggleActive () {
        const $navi = this.items.filter( `[href='${window.location.pathname}']` );

        this.items.removeClass( "-light" );

        if ( $navi.length ) {
            $navi.addClass( "-light" );
        }
    }
};


/**
 *
 * @private
 * @method onTapNavMenu
 * @param {object} e The Event object
 * @memberof menus.nav
 * @description Handles list icon event.
 *
 */
const onTapNavMenu = function ( e ) {
    const $target = $( e.target );

    if ( $target.is( ".js-nav" ) ) {
        nav.close();
    }
};


/**
 *
 * @private
 * @method onTapNavIcon
 * @memberof menus.nav
 * @description Handles list icon event.
 *
 */
const onTapNavIcon = function () {
    nav.open();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default nav;