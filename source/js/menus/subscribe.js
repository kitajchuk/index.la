import $ from "properjs-hobo";
import * as core from "../core";
import Menu from "./Menu";


/**
 *
 * @public
 * @namespace subscribe
 * @description Handles opening / closing the main subscribe menu.
 * @memberof menus
 *
 */
const subscribe = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.subscribe
     * @description Initializes subscribemenu interactions.
     *
     */
    init () {
        this.isSubmit = false;
        this.scriptUrl = "https://script.google.com/macros/s/AKfycbxSA6Gf2Jz4eCPcEW0sGRPS0LurIuSJvhfLbNg29WNYiMG6cO29/exec";
        this.isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.element = core.dom.body.find( ".js-subscribe" );
        this.field = this.element.find( ".js-subscribe-field" );
        this.button = this.element.find( ".js-subscribe-button" );
        this.menu = new Menu( this.element );
        this.bindEvents();

        core.log( "subscribe initialized" );
    },


    /**
     *
     * @public
     * @method open
     * @memberof menus.subscribe
     * @description Opens the subscribemenu.
     *
     */
    open () {
        this.menu.open();
        this.field[ 0 ].focus();
    },


    /**
     *
     * @public
     * @method close
     * @memberof menus.subscribe
     * @description Closes the subscribemenu.
     *
     */
    close () {
        this.menu.close();

        setTimeout(() => {
            this.field[ 0 ].value = "";
            this.element.removeClass( "is-valid-field is-submit" );

        }, 500 );
    },


    /**
     *
     * @public
     * @method bindEvents
     * @memberof menus.subscribe
     * @description Setup main interaction events for subscribe/header.
     *
     */
    bindEvents () {
        this.element.on( "click", onHitMenu );
        this.field.on( "keydown keyup", onKeyField );
        this.button.on( "click", ajaxGoogle );
        core.dom.body.on( "click", ".js-controller--subscribe", onHitIcon );
    }
};


const ajaxGoogle = function () {
    if ( subscribe.isSubmit ) {
        return;
    }

    subscribe.isSubmit = true;
    subscribe.element.addClass( "is-submit" );

    setTimeout(() => {
        subscribe.close();

    }, 2000 );

    $.ajax({
        url: subscribe.scriptUrl,
        data: {
            email: subscribe.field[ 0 ].value
        },
        dataType: "jsonp"
    })
    .then(() => {
        subscribe.isSubmit = false;
    });
};


const onKeyField = function ( e ) {
    if ( subscribe.isEmail.test( subscribe.field[ 0 ].value ) ) {
        subscribe.element.addClass( "is-valid-field" );

        if ( e.keyCode === 13 ) {
            ajaxGoogle();
        }

    } else {
        subscribe.element.removeClass( "is-valid-field" );
    }
};


/**
 *
 * @private
 * @method onHitMenu
 * @param {object} e The Event object
 * @memberof menus.subscribe
 * @description Handles list icon event.
 *
 */
const onHitMenu = function ( e ) {
    const $target = $( e.target );

    if ( $target.is( ".js-subscribe" ) ) {
        subscribe.close();
    }
};


/**
 *
 * @private
 * @method onHitIcon
 * @memberof menus.subscribe
 * @description Handles list icon event.
 *
 */
const onHitIcon = function () {
    subscribe.open();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default subscribe;
