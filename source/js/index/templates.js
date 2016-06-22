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



/******************************************************************************
 * Export
*******************************************************************************/
export default templates;
