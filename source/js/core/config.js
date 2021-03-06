import Easing from "properjs-easing";


/**
 *
 * @public
 * @namespace config
 * @memberof core
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member defaultEasing
     * @memberof core.config
     * @description The default easing function for javascript Tweens.
     *
     */
    defaultEasing: Easing.easeInOutCubic,


    /**
     *
     * @public
     * @member defaultDuration
     * @memberof core.config
     * @description The default duration for javascript Tweens.
     *
     */
    defaultDuration: 400,


    /**
     *
     * @public
     * @member lazyImageSelector
     * @memberof core.config
     * @description The string selector used for images deemed lazy-loadable.
     *
     */
    lazyImageSelector: ".js-lazy-image",


    /**
     *
     * @public
     * @member animSelector
     * @memberof core.config
     * @description The string selector used for animatables.
     *
     */
    animSelector: ".js-animate",


    /**
     *
     * @public
     * @member videoSelector
     * @memberof core.config
     * @description The string selector used for videos.
     *
     */
    videoSelector: ".js-video",


    /**
     *
     * @public
     * @member coverSelector
     * @memberof core.config
     * @description The string selector used for covers.
     *
     */
    coverSelector: ".js-cover",


    /**
     *
     * @public
     * @member lazyImageAttr
     * @memberof core.config
     * @description The string attribute for lazy image source URLs.
     *
     */
    lazyImageAttr: "data-img-src",


    /**
     *
     * @public
     * @member imageLoaderAttr
     * @memberof core.config
     * @description The string attribute ImageLoader gives loaded images.
     *
     */
    imageLoaderAttr: "data-imageloader"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;
