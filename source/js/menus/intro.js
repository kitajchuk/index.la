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
     * @method teardown
     * @memberof menus.intro
     * @description Method removes intro node from DOM.
     *
     */
    teardown () {
        setTimeout( () => {
            core.dom.intro.removeClass( "is-active" );

            setTimeout( () => {
                core.dom.intro.remove();

                core.emitter.fire( "app--intro-art" );

            }, _transTime );

        }, 2000 );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;