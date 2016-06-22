import dom from "./dom";
import config from "./config";
import emitter from "./emitter";
import ImageController from "./ImageController";


/**
 *
 * @public
 * @namespace images
 * @memberof core
 * @description Handles separation of image pre-loading and image lazy-loading.
 *
 */
const images = {
    /**
     *
     * @public
     * @method handlePreload
     * @memberof core.images
     * @param {function} callback The passed callback from `handleImages`
     * @description Method handles the `done` preloading event cycle.
     *
     */
    handlePreload ( callback ) {
        if ( typeof callback === "function" ) {
            callback();
        }

        emitter.fire( "app--preload-done" );
    },


    /**
     *
     * @public
     * @method handleImages
     * @memberof core.images
     * @param {object} $images Optionally, the image collection to load
     * @param {function} callback Optionally, a callback to fire when loading is done
     * @description Method handles separation of pre-load and lazy-load.
     * @returns {ImageController}
     *
     */
    handleImages ( $images, callback ) {
        let imageController = null;

        $images = ($images || dom.page.find( config.lazyImageSelector ));

        if ( $images.length ) {
            imageController = new ImageController( $images );

            imageController.on( "preload", this.handlePreload.bind( this, callback ) );

            imageController.on( "lazyload", () => {
                emitter.fire( "app--lazyload-done" );
            });

        } else {
            this.handlePreload( callback );
        }

        return imageController;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default images;
