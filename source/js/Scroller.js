import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class Scroller
 * @param {Element} element The dom element to work with.
 * @classdesc Handle scroll events for a DOMElement.
 * @fires scroll
 * @fires scrolldown
 * @fires scrollup
 * @fires scrollmax
 * @fires scrollmin
 *
 */
class Scroller extends Controller {
    constructor ( element ) {
        super();

        this._element = element;
        this._current = null;

        this.start();
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof Scroller
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            const current = this.getScrollY();
            const isScroll = (current !== this._current);
            const isScrollUp = (current < this._current);
            const isScrollDown = (current > this._current);
            const isScrollMax = (current !== this._current && this.isScrollMax());
            const isScrollMin = (current !== this._current && this.isScrollMin());

            // Fire blanket scroll event
            if ( isScroll ) {
                /**
                 *
                 * @event scroll
                 *
                 */
                this.fire( "scroll" );
            }

            // Fire scrollup and scrolldown
            if ( isScrollDown ) {
                /**
                 *
                 * @event scrolldown
                 *
                 */
                this.fire( "scrolldown" );

            } else if ( isScrollUp ) {
                /**
                 *
                 * @event scrollup
                 *
                 */
                this.fire( "scrollup" );
            }

            // Fire scrollmax and scrollmin
            if ( isScrollMax ) {
                /**
                 *
                 * @event scrollmax
                 *
                 */
                this.fire( "scrollmax" );

            } else if ( isScrollMin ) {
                /**
                 *
                 * @event scrollmin
                 *
                 */
                this.fire( "scrollmin" );
            }

            this._current = current;
        });
    }


    /**
     *
     * @instance
     * @description Returns the current window vertical scroll position
     * @memberof Scroller
     * @method getScrollY
     * @returns {number}
     *
     */
    getScrollY () {
        return this._element.scrollTop;
    }

    /**
     *
     * @instance
     * @description Get the max document scrollable height
     * @memberof Scroller
     * @method getScrollMax
     * @returns {number}
     *
     */
    getScrollMax () {
        return Math.max(
            this._element.scrollHeight,
            this._element.offsetHeight,
            this._element.clientHeight

        ) - window.innerHeight;
    }

    /**
     *
     * @instance
     * @description Determines if scroll position is at maximum for document
     * @memberof Scroller
     * @method isScrollMax
     * @returns {boolean}
     *
     */
    isScrollMax () {
        return (this.getScrollY() >= this.getScrollMax());
    }

    /**
     *
     * @instance
     * @description Determines if scroll position is at minimum for document
     * @memberof Scroller
     * @method isScrollMin
     * @returns {boolean}
     *
     */
    isScrollMin () {
        return (this.getScrollY() <= 0);
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Scroller;
