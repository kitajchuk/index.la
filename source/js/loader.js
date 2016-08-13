import * as core from "./core";


/**
 *
 * @public
 * @namespace loader
 * @description Handle load bar sequence.
 *
 */
const loader = {
    /**
     *
     * @public
     * @method init
     * @memberof loader
     * @description Setup for the loader bar.
     *
     */
    init () {
        this.node = core.dom.body.find( ".js-loader" );
        this.fill = this.node.find( ".js-loader-fill" );
        this.transTime = core.util.getTransitionDuration( this.node[ 0 ] );
    },


    /**
     *
     * @public
     * @method update
     * @param {number} percent The amount that is loaded
     * @memberof loader
     * @description Update how much has loaded.
     *
     */
    update ( percent ) {
        this.node.addClass( "is-active" );

        this.fill[ 0 ].style.width = `${percent}%`;
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof loader
     * @description Cleanup for the loader bar.
     *
     */
    teardown () {
        this.node.removeClass( "is-active" );

        setTimeout(() => {
            this.fill[ 0 ].style.width = "0px";

        }, this.transTime );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default loader;
