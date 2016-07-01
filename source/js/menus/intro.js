import * as core from "../core";


const _transTime = core.util.getTransitionDuration( core.dom.intro[ 0 ] );


/**
 *
 * @public
 * @namespace intro
 * @description Performs the branded load-in screen sequence.
 * @memberof menus
 *
 */
const intro = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.intro
     * @description Method initializes intro node in DOM.
     *
     */
    init () {
        this.fill = core.dom.intro.find( ".js-intro-fill" );

        core.dom.intro.addClass( "is-initialized" );

        core.emitter.on( "app--intro-teardown", this.teardown.bind( this ) );
    },


    /**
     *
     * @public
     * @method update
     * @param {number} percent The amount that is loaded
     * @memberof menus.intro
     * @description Update how much has loaded.
     *
     */
    update ( percent ) {
        this.fill[ 0 ].style.width = `${percent}%`;
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof menus.intro
     * @description Method removes intro node from DOM.
     *
     */
    teardown () {
        core.emitter.off( "app--intro-teardown" );

        core.dom.intro.removeClass( "is-active is-initialized" );

        setTimeout( () => {
            core.dom.intro.remove();

            core.emitter.fire( "app--intro-art" );

        }, _transTime );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
