/**
 *
 * Inlcude global stylesheet.
 *
 */
require( "../sass/splash.scss" );


import $ from "properjs-hobo";
import * as core from "./core";


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
        this.scriptUrl = "https://script.google.com/macros/s/AKfycbxSA6Gf2Jz4eCPcEW0sGRPS0LurIuSJvhfLbNg29WNYiMG6cO29/exec";
        this.isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.splash = core.dom.body.find( ".js-splash" );
        this.splashField = this.splash.find( ".js-splash-field" );
        this.splashButton = this.splash.find( ".js-splash-button" );
        this.message = core.dom.body.find( ".js-message" );

        this.splashField.on( "focus", () => {
            this.splash.addClass( "is-field-focused" );
        });

        this.splashField.on( "keydown", ( e ) => {
            if ( this.isEmail.test( this.splashField[ 0 ].value ) ) {
                this.splash.addClass( "is-valid-email" );

                if ( e.keyCode === 13 ) {
                    this.ajaxGoogle();
                }

            } else {
                this.splash.removeClass( "is-valid-email" );
            }
        });

        this.splashButton.on( "click", () => {
            this.ajaxGoogle();
        });
    }


    ajaxGoogle () {
        this.splash.removeClass( "is-valid-email" );

        $.ajax({
            url: this.scriptUrl,
            data: {
                email: this.splashField[ 0 ].value
            },
            dataType: "jsonp"
        })
        .then(() => {
            this.splash.removeClass( "is-active" );
            this.message.addClass( "is-active" );
        });
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
