import Vue from "vue";
import refine from "./refine";
import * as core from "../core";
import helpers from "./helpers";
import templates from "./templates";


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
     * @member dataType
     * @memberof artist
     * @description The content type.
     *
     */
    dataType: "artist",


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
     * @param {object} data The loaded app data
     * @memberof artist
     * @description Method runs once when window loads.
     *
     */
    init ( data ) {
        this.data = data;

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
        this.artist = helpers.getLinkedDocumentBySlug( this.dataType, slug, this.data );
        this.otherArtists = helpers.getLinkedDocuments( this.dataType, this.data ).filter( this.filterOtherArtists.bind( this ) ).slice( 0, this.otherLimit );
        this.viewData = {
            artist: this.artist,
            otherArtists: this.otherArtists
        };
        this.view = new Vue({
            el: core.dom.page[ 0 ],
            data: this.viewData,
            ready: () => {
                this.imageController = core.images.handleImages();
            },
            replace: false,
            template: templates.get( this.template )
        });

        refine.resetSearch();
        refine.resetFilters();

        core.dom.html.addClass( "is-artist-page" );
    },


    /**
     *
     * @public
     * @method filterOtherArtists
     * @memberof artist
     * @param {object} otherArtist The document object
     * @description Get other artists from the index that have matching categories
     * @returns {boolean}
     *
     */
    filterOtherArtists ( otherArtist ) {
        let ret = false;

        otherArtist.data.categories.value.forEach(( catA ) => {
            this.artist.data.categories.value.forEach(( catB ) => {
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
    teardown () {
        if ( this.view ) {
            this.view.$destroy();
            this.view = null;
            this.viewData = null;
            this.artist = null;
            this.otherArtists = null;
        }

        if ( this.imageController ) {
            this.imageController.destroy();
            this.imageController = null;
        }

        core.dom.html.removeClass( "is-artist-page" );
    },


    /**
     *
     * @public
     * @method ondata
     * @param {object} data The app data
     * @memberof artist
     * @description Listen for the app datas.
     *
     */
    ondata ( data ) {
        this.data = data;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default artist;
