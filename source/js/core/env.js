const DEV = "development";
const PROD = "production";
const STAGE = "staging";


/**
 *
 * @public
 * @namespace env
 * @memberof core
 * @description Set the app environment.
 *
 */
const env = {
    /**
     *
     * @member ENV
     * @memberof core.env
     * @description The applied environment ref.
     *              Looks at IP, localhost and staging for DEV, otherwise PROD
     *
     */
    ENV: (/^localhost|^[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}/g.test( document.domain ) ? DEV : /^staging/.test( document.domain ) ? STAGE : PROD),


    /**
     *
     * @method get
     * @memberof core.isDev
     * @description Returns true for dev.
     * @returns {boolean}
     *
     */
    isDev () {
        return (this.ENV === DEV);
    },


    /**
     *
     * @method get
     * @memberof core.isDev
     * @description Returns true for production.
     * @returns {boolean}
     *
     */
    isProduction () {
        return (this.ENV === PROD);
    },


    /**
     *
     * @method get
     * @memberof core.isStaging
     * @description Returns true for staging.
     * @returns {boolean}
     *
     */
    isStaging () {
        return (this.ENV === STAGE);
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default env;
