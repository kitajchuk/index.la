import * as core from "./core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class Cover
 * @param {Element} element The dom element to work with.
 * @classdesc Handle fullbleed cover image moments.
 *
 */
class Cover extends Controller {
    constructor ( element ) {
        super();

        this._element = element;

        if ( this._element.length ) {
            this.start();
        }
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof Cover
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            if ( core.util.isElementVisible( this._element[ 0 ] ) ) {
                core.dom.html.addClass( "is-cover" );

            } else {
                core.dom.html.removeClass( "is-cover" );
            }
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof Cover
     * @method destroy
     *
     */
    destroy () {
        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Cover;
