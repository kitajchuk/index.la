import Vue from "vue";
import * as core from "../core";


/**
 *
 * @description Template methods for Vue.js instances
 * @namespace templates
 * @public
 *
 */
const templates = {
    init () {
        this.templates = core.dom.body.find( ".js-templates" ).detach();
    },


    get ( id ) {
        return this.templates.find( `.js-${id}` )[ 0 ].outerHTML;
    }
};



/**
 *
 * @description Handle linkify-ing StructuredText fields, etc...
 *
 */
Vue.filter( "textify", ( block ) => {
    let ret = block.text;
    let sub = null;
    const links = [];

    if ( block.spans.length ) {
        block.spans.forEach(( span ) => {
            if ( span.type === "hyperlink" ) {
                sub = block.text.substring( span.start, span.end );

                links.push({
                    text: sub,
                    hype: `<a href="${span.data.value.url}" class="a -grey" target="_blank">${sub}</a>`
                });

            } else if ( span.type === "strong" || span.type === "em" ) {
                sub = block.text.substring( span.start, span.end );

                links.push({
                    text: sub,
                    hype: `<${span.type}>${sub}</${span.type}>`
                });
            }
        });

        links.forEach(( link ) => {
            ret = ret.replace( link.text, link.hype );
        });
    }

    return ret;
});


/**
 *
 * @description Handle adding breaks to some StructuredText fields.
 *
 */
Vue.filter( "breakify", ( blocks ) => {
    const ret = [];

    blocks.forEach(( block ) => {
        ret.push( block.text );
    });

    return ret.join( "<br />" );
});


/**
 *
 * @description Apply color styles from the color pickers.
 *
 */
Vue.filter( "colorize", ( colors, prefix ) => {
    const ret = [];

    // Background color
    if ( colors && colors.backgroundColor ) {
        ret.push( `.${prefix} { background-color: ${colors.backgroundColor.value}; }` );
        ret.push( `.header { background-color: ${colors.backgroundColor.value}; }` );
    }

    // Typography color
    if ( colors && colors.textColor ) {
        ret.push( `.${prefix} .h1 { color: ${colors.textColor.value}; }` );
        ret.push( `.${prefix} .h2 { color: ${colors.textColor.value}; }` );
        ret.push( `.${prefix} .h3 { color: ${colors.textColor.value}; }` );
        ret.push( `.${prefix} .h4 { color: ${colors.textColor.value}; }` );
        ret.push( `.${prefix} .p { color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--list { border-top-color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--list:before { background-color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--list:after { background-color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--back span { background-color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--back:before { background-color: ${colors.textColor.value}; }` );
        ret.push( `.header .icon--back:after { background-color: ${colors.textColor.value}; }` );
        ret.push( `.${prefix} .a:hover { color: ${colors.textColor.value}; }` );
    }

    // Border color
    if ( colors && colors.borderColor ) {
        ret.push( `.${prefix}__next { border-top-color: ${colors.borderColor.value}; }` );
    }

    return ret.join( "" );
});



/******************************************************************************
 * Export
*******************************************************************************/
export default templates;
