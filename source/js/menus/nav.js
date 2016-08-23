import $ from "properjs-hobo";
import * as core from "../core";
import Menu from "./Menu";
import Vue from "vue";


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
        this.menu = new Menu( this.element );
        this.isTipinAble = false;
        this.isLeftBehind = false;
        this.threshold = 500;
        this.initView();

        core.log( "nav initialized" );
    },


    /**
     *
     * @public
     * @method initView
     * @memberof menus.nav
     * @description Render the nav view.
     *
     */
    initView () {
        const data = core.cache.get( "data" );
        const viewData = {
            navs: data.nav.sort( core.util.sortByOrder ),
            socials: data.social
        };

        this.view = new Vue({
            el: this.element[ 0 ],
            data: viewData,
            replace: false,
            compiled: () => {
                this.items = this.element.find( ".js-nav-item" );
                this.bindEvents();
                this.toggleActive();
            }
        });
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
     * @method bindEvents
     * @memberof menus.nav
     * @description Setup main interaction events for nav/header.
     *
     */
    bindEvents () {
        this.element.on( "click", ( e ) => {
            const $target = $( e.target );

            if ( $target.is( ".js-nav" ) ) {
                this.close();
            }
        });

        this.trigger.on( "click", () => {
            this.open();
        });

        core.emitter.on( "app--scroll", onScroll );
        core.emitter.on( "app--scrollup", onScrollUp );
        core.emitter.on( "app--scrolldown", onScrollDown );
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

        this.items.removeClass( "is-active" );

        if ( $navi.length ) {
            $navi.addClass( "is-active" );
        }
    },


    /**
     *
     * @public
     * @method resetHeader
     * @memberof menus.nav
     * @description Reset all the header values.
     *
     */
    resetHeader () {
        this.isTipinAble = false;
        this.isLeftBehind = false;

        transformHeader( 0 );

        core.dom.header.removeClass( "is-tipinable" );
    }
};


const transformHeader = function ( y ) {
    core.util.translate3d(
        core.dom.header[ 0 ],
        0,
        core.util.px( y ),
        0
    );
};


const onScroll = function ( pos ) {
    const bounds = core.dom.header[ 0 ].getBoundingClientRect();
    const height = bounds.height * 2;
    const transformY = pos / 2;

    // Exit clauses
    if ( pos <= 0 && nav.isTipinAble ) {
        nav.isTipinAble = false;

        core.dom.header.removeClass( "is-tipinable" );

        return;
    }

    if ( pos <= height && !nav.isTipinAble ) {
        if ( nav.isLeftBehind ) {
            nav.isLeftBehind = false;
        }

        core.dom.header.removeClass( "is-tipinable" );

        transformHeader( -transformY );

    } else if ( pos > height && !nav.isLeftBehind ) {
        nav.isLeftBehind = true;

        core.dom.header.addClass( "is-tipinable" );

        transformHeader( -bounds.height );
    }
};


const onScrollUp = function ( pos ) {
    if ( nav.isLeftBehind && pos >= nav.threshold ) {
        nav.isTipinAble = true;

        transformHeader( 0 );
    }
};


const onScrollDown = function ( pos ) {
    const bounds = core.dom.header[ 0 ].getBoundingClientRect();

    if ( nav.isLeftBehind && pos >= nav.threshold ) {
        nav.isTipinAble = false;

        transformHeader( -bounds.height );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default nav;
