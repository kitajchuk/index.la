import $ from "properjs-hobo";
import * as core from "./core";


/**
 *
 * @public
 * @global
 * @class Movies
 * @param {Element} elements The dom elements to work with.
 * @classdesc Handle postMessage for Youtube and Vimeo.
 *
 */
class Movies {
    constructor ( elements ) {
        this._elements = elements;
        this._elements.on( "click", ( e ) => {
            const $node = $( e.target ).closest( core.config.videoSelector );
            const data = $node.data();
            const $iframe = $node.find( "iframe" );
            const winnow = $iframe[ 0 ].contentWindow;
            const message = (data.provider === "youtube" ? '{"event":"command","func":"playVideo","args":""}' : '{"method":"play"}');

            winnow.postMessage( message, "*" );

            $node.addClass( "is-active" );
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof Movies
     * @method destroy
     *
     */
    destroy () {
        this._elements.off( "click" );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Movies;
