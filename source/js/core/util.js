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
import config from "./config";
import emitter from "./emitter";
import detect from "./detect";


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
 * @description Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * @method shuffle
 * @param {object} arr The array to shuffle
 * @memberof core.util
 * @returns {array}
 *
 */
const shuffle = function ( arr ) {
    let i = arr.length - 1;
    let j = 0;
    let temp = arr[ i ];

    for ( i; i > 0; i-- ) {
        j = Math.floor( Math.random() * (i + 1) );
        temp = arr[ i ];

        arr[ i ] = arr[ j ];
        arr[ j ] = temp;
    }

    return arr;
};


/**
 *
 * @public
 * @method slugify
 * @memberof util
 * @param {string} str The string to slug
 * @description Slugify a string
 * @returns {string}
 *
 */
const slugify = function ( str ) {
    return str.toString().toLowerCase().trim()
        // Replace & with "and"
        .replace( /&/g, "-and-" )

        // Replace spaces, non-word characters and dashes with a single dash (-)
        .replace( /[\s\W-]+/g, "-" )

        // Replace leading trailing slashes with an empty string - nothing
        .replace( /^[-]+|[-]+$/g, "" );
};


/**
 *
 * @public
 * @method sortByOrder
 * @memberof util
 * @param {object} objA The left object
 * @param {object} objB The right object
 * @description Use with a collection array as executor func for [].sort()
 * @returns {number}
 *
 */
const sortByOrder = function ( objA, objB ) {
    let ret = 0;

    if ( objA.data.order.value < objB.data.order.value ) {
        ret = -1;

    } else {
        ret = 1;
    }

    return ret;
};


/**
 *
 * @public
 * @method sortByTimestamp
 * @memberof util
 * @param {object} objA The left object
 * @param {object} objB The right object
 * @description Use with a collection array as executor func for [].sort()
 * @returns {number}
 *
 */
const sortByTimestamp = function ( objA, objB ) {
    let ret = 0;

    if ( objA.data.timestamp.value > objB.data.timestamp.value ) {
        ret = -1;

    } else {
        ret = 1;
    }

    return ret;
};



/******************************************************************************
 * Export
*******************************************************************************/
export {
    // Loading
    loadImages,
    getElementsInView,
    isElementLoadable,
    isElementVisible,

    // Random
    px,
    noop,
    shuffle,
    slugify,
    translate3d,
    sortByOrder,
    sortByTimestamp,
    getTransitionDuration
};
