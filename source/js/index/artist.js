import refine from "./refine";
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
     * @member otherLimit
     * @memberof artist
     * @description The `other artists` limit cap.
     *
     */
    otherLimit: 12,


    /**
     *
     * @public
     * @method init
     * @memberof artist
     * @description Method runs once when window loads.
     *
     */
    init () {
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
        const data = router.getState( "data" );
        const viewArtist = data.artist.find(( el ) => {
            return (el.slug === slug);
        });
        const viewData = {
            artist: viewArtist,
            otherArtists: data.artist.filter( this.filterOtherArtists.bind( this, viewArtist ) ).slice( 0, this.otherLimit )
        };

        router.setView( this.template, viewData );
        refine.resetSearch();
        refine.resetFilters();
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

        otherArtist.data.categories.value.forEach(( catA ) => {
            thisArtist.data.categories.value.forEach(( catB ) => {
                if ( catA.value.data.name.value === catB.value.data.name.value ) {
                    ret = true;
                }
            });

        });

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
    teardown () {}
};


/******************************************************************************
 * Export
*******************************************************************************/
export default artist;
