import * as core from "./core";


/**
 *
 * @public
 * @global
 * @class Socket
 * @classdesc Client side WebSocket interfacing mechanism.
 * @author kitajchuk
 *
 */
class Socket {
    constructor () {
        this.socket = null;
        this.onEvents = {};
        this.getEvents = {};
        this.connected = false;
        this.host = (core.env.isDev() ? "localhost:8000" : "node.theindex.la");
    }


    /**
     *
     * @instance
     * @method on
     * @param {string} evt The {@link Socket.broadcast} event
     * @param {function} cb The callback to fire when server responds
     * @description Bind array of callbacks to a broadcast event.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    on ( evt, cb ) {
        if ( !this.onEvents[ evt ] ) {
            this.onEvents[ evt ] = [];
        }

        this.onEvents[ evt ].push( cb );
    }

    /**
     *
     * @instance
     * @method get
     * @param {string} evt The {@link Socket.broadcast} event
     * @param {object} dt The data to pass to the server
     * @param {function} cb The callback to fire when server responds
     * @description Bind single callback request cycle to a broadcast event.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    get ( evt, dt, cb ) {
        if ( !this.getEvents[ evt ] ) {
            const data = {};
            const func = ( d ) => {
                delete this.getEvents[ evt ];

                if ( typeof cb === "function" ) {
                    cb( d );
                }
            };

            data.event = evt;
            data.value = dt;

            this.getEvents[ evt ] = func;
            this.send( data );
        }
    }

    /**
     *
     * @instance
     * @method post
     * @param {string} evt The {@link Socket.broadcast} event
     * @param {object} dt The data to pass to the server
     * @param {function} cb The callback to fire when server responds
     * @description Bind single callback request cycle to a broadcast event.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    post () {
        this.get( ...arguments );
    }

    /**
     *
     * @instance
     * @method send
     * @param {object} dt The data to pass to the server
     * @description Send data to the WebSocketServer.
     * <ul>
     *      <li>dt.event - The event being broadcast</li>
     *      <li>dt.value - The serialized json to process</li>
     * </ul>
     * @memberof Socket
     * @author kitajchuk
     *
     */
    send ( dt ) {
        this.socket.send( JSON.stringify( dt ) );
    }

    /**
     *
     * @instance
     * @method emit
     * @param {string} evt The {@link Socket.broadcast} event
     * @param {object} dt The data returned from the server
     * @description Broadcast event to all bound callbacks on the client.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    emit ( evt, dt ) {
        if ( this.onEvents[ evt ] ) {
            let i = this.onEvents[ evt ].length;

            for ( i; i--; ) {
                this.onEvents[ evt ][ i ].call( this, dt );
            }
        }
    }

    /**
     *
     * @instance
     * @method connect
     * @param {function} cb The callback to fire on connected
     * @description Open the WebSocket client connection to the WebSocketServer.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    connect ( cb ) {
        if ( !this.connected ) {
            this.socket = new WebSocket( `ws://${this.host}`, "echo-protocol" );

            /**
             *
             * @private
             * @event Socket#onopen
             * @description Handles opened connection to the WebSocketServer.
             * @memberof Socket
             * @author kitajchuk
             *
             */
            this.socket.onopen = () => {
                this.connected = true;

                if ( typeof cb === "function" ) {
                    cb();

                } else {
                    this.emit( "open" );
                }
            };

            /**
             *
             * @private
             * @event Socket#onmessage
             * @description Handles incoming messages from the WebSocketServer.
             * @memberof Socket
             * @param {object} evt The socket event object
             * @author kitajchuk
             *
             */
            this.socket.onmessage = ( evt ) => {
                const data = JSON.parse( evt.data );

                // Check GET events for bound callback
                if ( this.getEvents[ data.event ] ) {
                    this.getEvents[ data.event ].call( null, data.value );

                // Broadcast event to all bound callbacks
                } else {
                    this.emit( data.event, data.value );
                }
            };

            /**
             *
             * @private
             * @event Socket#onclose
             * @description Handles closed connection to the WebSocketServer.
             * @memberof Socket
             * @author kitajchuk
             *
             */
            this.socket.onclose = () => {
                this.connected = false;
                this.emit( "close" );
            };
        }
    }

    /**
     *
     * @instance
     * @method disconnect
     * @description Close the WebSocket client connection.
     * @memberof Socket
     * @author kitajchuk
     *
     */
    disconnect () {
        this.socket.close();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Socket;
