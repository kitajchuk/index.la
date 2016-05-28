import $ from "properjs-hobo";
import * as util from "./util";


/**
 *
 * @public
 * @namespace api
 * @memberof core
 * @description Provide some api methods for accessing content via JS.
 *
 */
const api = {
    /**
     *
     * @public
     * @member data
     * @memberof core.api
     * @description URLs this little api needs to use.
     *
     */
    data: {
        site: {
            url: location.origin
        }
    },


    /**
     *
     * @public
     * @member dataType
     * @memberof core.api
     * @description Default dataType for the `request` api method.
     *
     */
    dataType: "json",


    /**
     *
     * @public
     * @member method
     * @memberof core.api
     * @description Default method for the `request` api method.
     *
     */
    method: "GET",


    /**
     *
     * @public
     * @method endpoint
     * @param {string} uri The collection uri
     * @memberof core.api
     * @description Creates the fullUrl from a collection uri.
     * @returns {string}
     *
     */
    endpoint ( uri ) {
        return [this.data.site.url, uri.replace( /^\/|\/$/g, "" )].join( "/" );
    },


    /**
     *
     * @public
     * @method request
     * @param {string} url The API URL
     * @param {object} params Merge params to send
     * @param {object} options Merge config to pass to $.ajax()
     * @memberof core.api
     * @description Creates the fullUrl from an API uri.
     * @returns {Promise}
     *
     */
    request ( url, params, options ) {
        const data = util.extendObject(
            {
                format: this.format,
                nocache: true
            },
            params
        );
        const opts = util.extendObject(
            {
                url,
                data,
                dataType: this.dataType,
                method: this.method
            },
            options
        );

        return $.ajax( opts );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default api;