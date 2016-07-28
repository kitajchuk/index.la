import $ from "properjs-hobo";
import * as core from "../core";
import Menu from "./Menu";


/**
 *
 * @public
 * @namespace submit
 * @description Handles opening / closing the main submit menu.
 * @memberof menus
 *
 */
const submit = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.submit
     * @description Initializes submitmenu interactions.
     *
     */
    init () {
        this.isSubmit = false;
        this.scriptUrl = "https://script.google.com/macros/s/AKfycby_yOLDcfYSBgEW0aSP3yvHRCDPOhinfDs4QBIbk5jstVPJT2c/exec";
        this.element = core.dom.body.find( ".js-submit" );
        this.field = this.element.find( ".js-submit-field" );
        this.button = this.element.find( ".js-submit-button" );
        this.menu = new Menu( this.element );
        this.bindEvents();

        core.log( "submit initialized" );
    },


    /**
     *
     * @public
     * @method open
     * @memberof menus.submit
     * @description Opens the submitmenu.
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
     * @memberof menus.submit
     * @description Closes the submitmenu.
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
     * @memberof menus.submit
     * @description Setup main interaction events for submit/header.
     *
     */
    bindEvents () {
        this.element.on( "click", onHitMenu );
        this.field.on( "keydown keyup", onKeyField );
        this.button.on( "click", ajaxGoogle );
        core.dom.body.on( "click", ".js-controller--submit", onHitIcon );
    }
};


const ajaxGoogle = function () {
    if ( this.isSubmit ) {
        return;
    }

    submit.isSubmit = true;
    submit.element.addClass( "is-submit" );

    setTimeout(() => {
        submit.close();

    }, 2000 );

    $.ajax({
        url: submit.scriptUrl,
        data: {
            submission: submit.field[ 0 ].value
        },
        dataType: "jsonp"
    })
    .then(() => {
        submit.isSubmit = false;
    });
};


const onKeyField = function ( e ) {
    if ( submit.field[ 0 ].value !== "" ) {
        submit.element.addClass( "is-valid-field" );

        if ( e.keyCode === 13 ) {
            ajaxGoogle();
        }

    } else {
        submit.element.removeClass( "is-valid-field" );
    }
};


/**
 *
 * @private
 * @method onHitMenu
 * @param {object} e The Event object
 * @memberof menus.submit
 * @description Handles list icon event.
 *
 */
const onHitMenu = function ( e ) {
    const $target = $( e.target );

    if ( $target.is( ".js-submit" ) ) {
        submit.close();
    }
};


/**
 *
 * @private
 * @method onHitIcon
 * @memberof menus.submit
 * @description Handles list icon event.
 *
 */
const onHitIcon = function () {
    submit.open();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default submit;
