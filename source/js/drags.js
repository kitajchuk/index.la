import * as core from "./core";
import loadJS from "fg-loadjs";


let _draggable = null;
let _isSuppressed = false;


/**
 *
 * @public
 * @namespace drags
 * @memberof core
 * @description Handles mapping drag events to replicate ./core/scrolls.js.
 *
 */
const drags = {
    /**
     *
     * @public
     * @method init
     * @memberof core.drags
     * @description Method runs once when window loads.
     *
     */
    init () {
        loadJS( "/js/gsap.js", () => {
            _draggable = new window.Draggable( core.dom.page[ 0 ], {
                bounds: core.dom.body[ 0 ],
                dragResistance: 0.5,
                edgeResistance: 0.5,
                lockAxis: true,
                //onDragEnd: () => {},
                onDragStart: onDraggableStart,
                onThrowComplete: onDraggableEnd,
                onDrag: onDraggable,
                onThrowUpdate: onDraggable,
                throwProps: true,
                type: "y",
                zIndexBoost: false
            });

            core.log( "drags initialized" );
        });
    },


    /**
     *
     * @public
     * @method topout
     * @param {number} top Optionally, the Y position to apply
     * @memberof core.drags
     * @description Method set Y position to argument value or zero.
     *
     */
    topout ( top ) {
        top = top || 0;

        window.TweenLite.to(
            core.dom.page[ 0 ],
            0,
            {
                y: 0
            }
        );

        onDraggable();
    },


    /**
     *
     * @public
     * @method suppress
     * @param {boolean} bool Whether or not to suppress
     * @memberof core.drags
     * @description Method will suppress scroll position broadcasting.
     *
     */
    suppress ( bool ) {
        _isSuppressed = bool;
    },


    /**
     *
     * @public
     * @method clearStates
     * @memberof core.drags
     * @description Method removes all applied classNames from this module
     *
     */
    clearStates () {
        core.dom.html.removeClass( "is-scrolling-up is-scrolling-down is-scrolling" );
    }
};


const getDragPosition = function () {
    return Math.abs( _draggable.y );
};


/**
 *
 * @private
 * @method broadcast
 * @param {string} event The scroll event to emit
 * @param {number} position The current scroll position
 * @memberof core.drags
 * @description Method will emit scroll position information.
 *
 */
const broadcast = function ( event, position ) {
    if ( _isSuppressed ) {
        return;
    }

    core.emitter.fire( event, position );
};


/**
 *
 * @private
 * @method onDraggableStart
 * @memberof core.drags
 * @description Method handles start of drag.
 *
 */
const onDraggableStart = function () {
    broadcast( "app--scroll-start", getDragPosition() );
};


/**
 *
 * @private
 * @method onDraggableEnd
 * @memberof core.drags
 * @description Method handles end of drag.
 *
 */
const onDraggableEnd = function () {
    drags.clearStates();

    broadcast( "app--scroll-end", getDragPosition() );
};


/**
 *
 * @private
 * @method onDraggableUp
 * @param {number} dragPos the drag Y position
 * @memberof core.drags
 * @description Method handles upward drag event.
 *
 */
const onDraggableUp = function ( dragPos ) {
    broadcast( "app--scroll-up", dragPos );

    core.dom.html.removeClass( "is-scrolling-down" ).addClass( "is-scrolling-up" );
};


/**
 *
 * @private
 * @method onDraggableDown
 * @param {number} dragPos the drag Y position
 * @memberof core.drags
 * @description Method handles downward drag event.
 *
 */
const onDraggableDown = function ( dragPos ) {
    broadcast( "app--scroll-down", dragPos );

    core.dom.html.removeClass( "is-scrolling-up" ).addClass( "is-scrolling-down" );
};


/**
 *
 * @private
 * @method onDraggable
 * @memberof core.drags
 * @description Method handles Draggable dragging.
 *
 */
const onDraggable = function () {
    const dragPos = getDragPosition();

    broadcast( "app--scroll", dragPos );

    if ( _draggable.getDirection() === "down" ) {
        onDraggableUp( dragPos );

    } else {
        onDraggableDown( dragPos );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default drags;