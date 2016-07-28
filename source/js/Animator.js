import Controller from "properjs-controller";
import * as core from "./core";


/**
 *
 * @public
 * @global
 * @class Animator
 * @param {Element} element The dom element to work with.
 * @classdesc Handle scroll events for a DOMElement.
 * @fires scroll
 * @fires scrolldown
 * @fires scrollup
 * @fires scrollmax
 * @fires scrollmin
 *
 */
class Animator extends Controller {
    constructor ( elements ) {
        super();

        this._elements = elements;

        this.start();
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof Animator
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            this._elements.forEach(( element, i ) => {
                if ( core.util.isElementVisible( element ) ) {
                    this._elements.eq( i ).addClass( "is-animate" );

                } else {
                    this._elements.eq( i ).removeClass( "is-animate" );
                }
            });
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof Animator
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
export default Animator;
