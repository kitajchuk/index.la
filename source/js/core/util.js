/**
 *
 * @public
 * @namespace util
 * @memberof core
 * @description Houses app-wide utility methods.
 *
 */
import $ from "properjs-hobo";
import ImageLoader from "properjs-imageloader";
import loadCSS from "fg-loadcss";
import loadJS from "fg-loadjs";
import dom from "./dom";
import config from "./config";
import detect from "./detect";
import emitter from "./emitter";


/**
 *
 * @description Add pixel units when inline styling
 * @method px
 * @param {string} str The value to pixel-ify
 * @memberof core.util
 * @returns {string}
 *
 */
const px = function ( str ) {
    return `${str}px`;
};


/**
 *
 * @description Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof core.util
 *
 */
const translate3d = function ( el, x, y, z ) {
    el.style[ detect.getPrefixed( "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


/**
 *
 * @description Module onImageLoadHander method, handles event
 * @method isElementLoadable
 * @param {object} el The DOMElement to check the offset of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementLoadable = function ( el ) {
    let ret = false;

    if ( el ) {
        const bounds = el.getBoundingClientRect();

        ret = ( bounds.top < (window.innerHeight * 2) );
    }

    return ret;
};


/**
 *
 * @description Module isElementVisible method, handles element boundaries
 * @method isElementVisible
 * @param {object} el The DOMElement to check the offsets of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementVisible = function ( el ) {
    let ret = false;

    if ( el ) {
        const bounds = el.getBoundingClientRect();

        ret = ( bounds.top < window.innerHeight && bounds.bottom > 0 );
    }

    return ret;
};


/**
 *
 * @method getElementsInView
 * @memberof core.util
 * @param {Hobo} $nodes The collection to process
 * @param {function} executor Optional method to determin `in view`
 * @description Get elements within a loadable position on the page
 * @returns {Hobo}
 *
 */
const getElementsInView = function ( $nodes, executor ) {
    let i = $nodes.length;
    const ret = [];

    executor = (executor || isElementVisible);

    for ( i; i--; ) {
        if ( executor( $nodes[ i ] ) ) {
            ret.push( $nodes[ i ] );
        }
    }

    return $( ret );
};


/**
 *
 * @description Fresh query to lazyload images on page
 * @method loadImages
 * @param {object} images Optional collection of images to load
 * @param {function} handler Optional handler for load conditions
 * @memberof core.util
 * @returns {ImageLoader}
 *
 */
const loadImages = function ( images, handler ) {
    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || $( config.lazyImageSelector ));

    // Hook here to determine image variant sizes to load ?
    emitter.fire( "app--util--load-images", images );

    return new ImageLoader({
        elements: images,
        property: config.lazyImageAttr,
        executor: handler
    });
};


/**
 *
 * @description Load all deps for a module
 * @method loadDependencies
 * @param {object} data The dependency data
 * @param {function} callback Function to call when all deps are loaded
 * @memberof core.util
 *
 */
const loadDependencies = function ( data, callback ) {
    let i = 0;
    const total = data.sources.length;
    const onload = function () {
        i++;

        if ( i === total ) {
            if ( typeof data.callback === "function" ) {
                data.callback();
            }

            if ( typeof callback === "function" ) {
                callback();
            }
        }
    };

    data.sources.forEach(( source ) => {
        if ( source.type === "script" ) {
            loadJS( (config.asyncScriptPath + source.file), onload );

        } else if ( source.type === "style" ) {
            loadCSS( (config.asyncStylePath + source.file) ).onloadcssdefined( onload );
        }
    });
};


/**
 *
 * @description Toggle on/off scrollability
 * @method disableMouseWheel
 * @param {boolean} enable Flag to enable/disable
 * @memberof core.util
 *
 */
const disableMouseWheel = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "DOMMouseScroll mousewheel", preNoop );

    } else {
        dom.doc.off( "DOMMouseScroll mousewheel" );
    }
};


/**
 *
 * @description Toggle on/off touch movement
 * @method disableTouchMove
 * @param {boolean} enable Flag to enable/disable
 * @memberof core.util
 *
 */
const disableTouchMove = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "touchmove", preNoop );

    } else {
        dom.doc.off( "touchmove" );
    }
};


/**
 *
 * @description Get the applied transition duration from CSS
 * @method getTransitionDuration
 * @param {object} el The DOMElement
 * @memberof core.util
 * @returns {number}
 *
 */
const getTransitionDuration = function ( el ) {
    let ret = 0;
    let duration = null;
    let isSeconds = false;
    let multiplyBy = 1000;

    if ( el ) {
        duration = getComputedStyle( el )[ "transition-duration" ];
        isSeconds = String( duration ).indexOf( "ms" ) === -1;
        multiplyBy = isSeconds ? 1000 : 1;

        ret = parseFloat( duration ) * multiplyBy;
    }

    return ret;
};


/**
 *
 * @description All true all the time
 * @method noop
 * @memberof core.util
 * @returns {boolean}
 *
 */
const noop = function () {
    return true;
};


/**
 *
 * @description Noop a preventDefault() for event handlers
 * @method preNoop
 * @memberof core.util
 * @param {object} e The event object
 * @returns {boolean}
 *
 */
const preNoop = function ( e ) {
    e.preventDefault();
    return false;
};


/**
 *
 * @public
 * @method extendObject
 * @memberof util
 * @param {object} target The target object/array
 * @param {object} arrow The incoming object/array
 * @description Merge or clone objects and arrays
 * @returns {object}
 *
 */
const extendObject = function ( target, arrow ) {
    let i = null;
    const ret = target;

    // Merge Arrays
    // This is really just used as a `cloning` mechanism
    if ( Array.isArray( arrow ) ) {
        i = arrow.length;

        for ( i; i--; ) {
            ret[ i ] = arrow[ i ];
        }

    // Merge Objects
    // This could `clone` as well, but is better for merging 2 objects
    } else {
        for ( i in arrow ) {
            if ( arrow.hasOwnProperty( i ) ) {
                ret[ i ] = arrow[ i ];
            }
        }
    }

    return ret;
};



/******************************************************************************
 * Export
*******************************************************************************/
export {
    // Loading
    loadImages,
    loadDependencies,
    getElementsInView,
    isElementLoadable,
    isElementVisible,

    // Disabling
    disableTouchMove,
    disableMouseWheel,

    // Random
    px,
    noop,
    translate3d,
    extendObject,
    getTransitionDuration
};