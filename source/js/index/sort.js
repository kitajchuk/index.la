/**
 *
 * @description Sort methods for datas
 * @member sort
 * @memberof sort
 *
 */
const sort = {
    by ( key, data ) {
        data.sort(( a, b ) => {
            let ret = 0;

            a = (a[ key ] !== undefined ? a[ key ] : typeof a.data[ key ].value === "object" ? a.data[ key ].value.data.name.value : a.data[ key ].value);
            b = (b[ key ] !== undefined ? b[ key ] : typeof b.data[ key ].value === "object" ? b.data[ key ].value.data.name.value : b.data[ key ].value);

            console.log( a, " - ", b );

            if ( a < b ) {
                ret = -1;

            } else {
                ret = 1;
            }

            return ret;
        });
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default sort;