// Class
var Class = function ( connection ) {
    var self = this;

    this.events = {};
    this.connection = connection;

    this.connection.on( "message", function ( message ) {
        // { event, value }
        var data = JSON.parse( message.utf8Data );

        if ( self.events[ data.event ] ) {
            self.emit( self.events[ data.event ], data.value );
        }
    });
};


// Prototype
Class.prototype = {
    emit: function ( evts, data ) {
        for ( var i = 0, len = evts.length; i < len; i++ ) {
            evts[ i ].call( null, data );
        }
    },


    on: function ( evt, cb ) {
        if ( !this.events[ evt ] ) {
            this.events[ evt ] = [];
        }

        this.events[ evt ].push( cb );
    },


    success: function ( evt, val ) {
        this.connection.send(JSON.stringify({
            event: evt,
            value: val
        }));
    },


    failure: function ( evt, msg ) {
        this.connection.send(JSON.stringify({
            event: evt,
            value: {
                error: true,
                message: msg
            }
        }));
    }
};


// Export
module.exports = {
    Class: Class
};
