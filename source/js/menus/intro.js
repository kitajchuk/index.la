import * as core from "../core";
import loader from "../loader";


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
        this.transTime = core.util.getTransitionDuration( core.dom.intro[ 0 ] );

        loader.init();
        loader.update( 5 );

        core.dom.intro.addClass( "is-initialized" );

        core.emitter.on( "app--intro-teardown", this.teardown.bind( this ) );
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
            loader.teardown();

            core.dom.intro.remove();

            core.emitter.fire( "app--intro-art" );

        }, this.transTime );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
