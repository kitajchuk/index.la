import $ from "properjs-hobo";
import router from "../router";
import * as core from "../core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @namespace artist
 * @description A nice description of what this module does...
 *
 */
const artist = {
    /**
     *
     * @public
     * @member template
     * @memberof artist
     * @description The template context.
     *
     */
    template: "artist",


    /**
     *
     * @public
     * @member otherLimit
     * @memberof artist
     * @description The `other artists` limit cap.
     *
     */
    otherLimit: 6,


    /**
     *
     * @public
     * @method init
     * @param {App} app The App Instance
     * @memberof artist
     * @description Method runs once when window loads.
     *
     */
    init ( app ) {
        this.app = app;

        core.emitter.on( "app--view-artist", this.load.bind( this ) );
        core.emitter.on( "app--view-teardown", this.teardown.bind( this ) );

        core.log( "artist initialized" );
    },


    /**
     *
     * @public
     * @method load
     * @param {string} slug The document slug
     * @memberof artist
     * @description Method performs onloading actions for this module.
     *
     */
    load ( slug ) {
        const documents = router.getState( "artists" );

        if ( documents ) {
            this.view( slug );

        } else {
            this.app.socket.get( "index-documents", { type: "artists" }, ( data ) => {
                router.setState( "artists", data, true );

                this.view( slug );
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @param {string} slug The uri slug
     * @memberof artist
     * @description Method renders the view.
     *
     */
    view ( slug ) {
        const documents = router.getState( "artists" );
        const viewArtist = documents.find(( el ) => {
            return (el.slug === slug);
        });

        router.setView( this.template, {
            artist: viewArtist,
            otherArtists: core.util.shuffle( documents )
                                    // Filter out only artists with matching categories
                                    .filter( this.filterOtherArtists.bind( this, viewArtist ) )
                                    // Slice the top dozen off the matched artists
                                    .slice( 0, this.otherLimit )
        });

        this.bindScroll();
        this.bindVideos();
    },


    /**
     *
     * @public
     * @method bindVideos
     * @memberof artist
     * @description Handle any videos on the page. Ideally Vimeo.
     *
     */
    bindVideos () {
        core.dom.page.find( ".js-artist-video" ).on( "click", ( e ) => {
            const $node = $( e.target ).closest( ".js-artist-video" );
            const data = $node.data();
            const $iframe = $node.find( "iframe" );
            const winnow = $iframe[ 0 ].contentWindow;
            const message = (data.provider === "youtube" ? '{"event":"command","func":"playVideo","args":""}' : '{"method":"play"}');

            winnow.postMessage( message, "*" );

            $node.addClass( "is-active" );
        });
    },


    /**
     *
     * @public
     * @method bindScroll
     * @memberof artist
     * @description Hide / show artist info based on page position.
     *
     */
    bindScroll () {
        const info = core.dom.page.find( ".js-artist-info" );
        const others = core.dom.page.find( ".js-artist-others" );

        this.scroller = new Controller();
        this.scroller.go(() => {
            if ( core.util.isElementVisible( others[ 0 ] ) ) {
                info.addClass( "is-inactive" );

            } else {
                info.removeClass( "is-inactive" );
            }
        });
    },


    /**
     *
     * @public
     * @method unbindScroll
     * @memberof artist
     * @description Destroy the Controller instance on teardown.
     *
     */
    unbindScroll () {
        if ( this.scroller ) {
            this.scroller.stop();
            this.scroller = null;

            delete this.scroller;
        }
    },


    /**
     *
     * @public
     * @method filterOtherArtists
     * @memberof artist
     * @param {object} thisArtist The @this artist document
     * @param {object} otherArtist The document object
     * @description Get other artists from the index that have matching categories
     * @returns {boolean}
     *
     */
    filterOtherArtists ( thisArtist, otherArtist ) {
        let ret = false;

        if ( thisArtist.id !== otherArtist.id ) {
            otherArtist.data.categories.value.forEach(( catA ) => {
                thisArtist.data.categories.value.forEach(( catB ) => {
                    if ( catA.category.value.data.name.value === catB.category.value.data.name.value ) {
                        ret = true;
                    }
                });

            });
        }

        return ret;
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof artist
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        this.unbindScroll();
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default artist;
