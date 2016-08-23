import router from "../router";
import * as core from "../core";


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
     * @member relatedLimit
     * @memberof artist
     * @description The `other artists` limit cap.
     *
     */
    relatedLimit: 6,


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
     * @param {string} uri The document uri
     * @memberof artist
     * @description Method performs onloading actions for this module.
     *
     */
    load ( uri ) {
        const documents = core.cache.get( "artists" );

        if ( documents ) {
            this.view( uri );

        } else {
            this.app.socket.get( "index-documents", { type: "artists" }, ( data ) => {
                core.cache.set( "artists", data );

                this.view( uri );
            });
        }
    },


    /**
     *
     * @public
     * @method view
     * @param {string} uri The uri slug
     * @memberof artist
     * @description Method renders the view.
     *
     */
    view ( uri ) {
        const documents = core.cache.get( "artists" );
        const viewArtist = documents.find(( el ) => {
            return (el.uri === uri);
        });
        let mobile = null;

        if ( core.detect.isDevice() ) {
            mobile = viewArtist.data.gallery.value[ 0 ];
            viewArtist.data.gallery.value = viewArtist.data.gallery.value.slice( 1, viewArtist.data.gallery.value.length );
        }

        router.setView( this.template, {
            mobile: mobile,
            artist: viewArtist,
            relatedArtists: core.util.shuffle( documents )
                                    // Filter out only artists with matching categories
                                    .filter( this.filterRelatedArtists.bind( this, viewArtist ) )
                                    // Slice the amount we want off the matched artists
                                    .slice( 0, this.relatedLimit )
        });

        this.bindScroll();
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
        const related = core.dom.page.find( ".js-artist-related" );

        this._onScroller = () => {
            if ( core.util.isElementVisible( related[ 0 ] ) ) {
                info.addClass( "is-inactive" );

            } else {
                info.removeClass( "is-inactive" );
            }
        };

        core.emitter.on( "app--scroll", this._onScroller );
    },


    /**
     *
     * @public
     * @method filterRelatedArtists
     * @memberof artist
     * @param {object} thisArtist The @this artist document
     * @param {object} relatedArtist The document object
     * @description Get other artists from the index that have matching categories
     * @returns {boolean}
     *
     */
    filterRelatedArtists ( thisArtist, relatedArtist ) {
        let ret = false;

        if ( thisArtist.id !== relatedArtist.id ) {
            relatedArtist.data.categories.value.forEach(( catA ) => {
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
        this.gallery = null;

        if ( this._onScroller ) {
            core.emitter.off( "app--scroll", this._onScroller );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default artist;
