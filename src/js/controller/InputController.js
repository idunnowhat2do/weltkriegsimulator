/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2016-2017 - http://www.igorski.nl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";

const Messages     = require( "../definitions/Messages" );
const Pubsub       = require( "pubsub-js" );
const ActorUtil    = require( "../util/ActorUtil" );
const Bullet       = require( "../model/actors/Bullet" );
const EventHandler = require( "../util/EventHandler" );

const DEFAULT_BLOCKED = [ 8, 32, 37, 38, 39, 40 ];
let blockDefaults = true, handler;

const activeMovement = {
    up: false,
    down: false,
    left: false,
    right: false
};

let gameModel, player;

const InputController = module.exports = {

    init( wks ) {

        gameModel = wks.gameModel;
        player = gameModel.player;

        [
            Messages.GAME_START,
            Messages.GAME_OVER

        ].forEach(( msg ) => Pubsub.subscribe( msg, handleBroadcast ));
    },

    // player controls

    left( speed = .5, killExisting = false ) {
        if ( !activeMovement.left ) {
            activeMovement.left = true;
            if ( killExisting )
                TweenMax.killTweensOf( player, true, { "xSpeed": true });
            ActorUtil.setDelayed( player, "xSpeed", -5, speed );
        }
    },

    right( speed = .5, killExisting = false ) {
        if ( !activeMovement.right ) {
            activeMovement.right = true;
            if ( killExisting )
                TweenMax.killTweensOf( player, true, { "xSpeed": true });
            ActorUtil.setDelayed( player, "xSpeed", 5, speed );
        }
    },

    up( speed = .5, killExisting = false ) {
        if ( !activeMovement.up ) {
            activeMovement.up = true;
            if ( killExisting )
                TweenMax.killTweensOf( player, true, { "ySpeed": true });

            ActorUtil.setDelayed( player, "ySpeed", -5, speed );
        }
    },

    down( speed = .5, killExisting = false ) {
        if ( !activeMovement.down ) {
            activeMovement.down = true;
            if ( killExisting )
                TweenMax.killTweensOf( player, true, { "ySpeed": true });
            ActorUtil.setDelayed( player, "ySpeed", 5, speed );
        }
    },

    /**
     * cancels all horizontal movement
     * (reduces speed gradually to a stand still)
     *
     * @param {boolean=} cancelRight whether to cancel right movement when true
     *                   or to cancel left movement when false
     */
    cancelHorizontal( cancelRight = false ) {
        if ( cancelRight )
            activeMovement.right = false;
        else
            activeMovement.left = false;

        if ( !activeMovement.left && !activeMovement.right && player.xSpeed !== 0 )
            ActorUtil.setDelayed( player, "xSpeed", 0, .5 );
    },

    /**
     * cancels all vertical movement
     * (reduces speed gradually to a stand still)
     *
     * @param {boolean=} cancelUp whether to cancel up movement when true
     *                   or to cancel down movement when false
     */
    cancelVertical( cancelUp = false ) {
        if ( cancelUp )
            activeMovement.up = false;
        else
            activeMovement.down = false;

        if ( !activeMovement.up && !activeMovement.down && player.ySpeed !== 0 )
            ActorUtil.setDelayed( player, "ySpeed", 0, .5 );
    }
};

/* private handlers */

function handleBroadcast( msg, payload ) {
    switch ( msg ) {
        case Messages.GAME_START:
            if ( !handler ) {
                handler = new EventHandler();
                handler.listen( window, "keydown", handleKeyDown );
                handler.listen( window, "keyup",   handleKeyUp );
            }
            break;

        case Messages.GAME_OVER:
            if ( handler ) {
                handler.dispose();
                handler = null;
            }
            break;
    }
}

function handleKeyDown( aEvent ) {

    const keyCode = aEvent.keyCode;

    // prevent defaults when using the arrows, space (prevents page jumps) and backspace (navigate back in history)

    if ( blockDefaults && DEFAULT_BLOCKED.indexOf( keyCode ) > -1 )
        aEvent.preventDefault();

    if ( gameModel.active ) {

        switch ( keyCode ) {

            case 32: // spacebar
                if ( !player.firing )
                    player.startFiring();
                break;

            case 38: // up
                InputController.up();
                break;

            case 40: // down
                InputController.down();
                break;

            case 39: // right
                InputController.right();
                break;

            case 37: // left
                InputController.left();
                break;

            case 13: // enter
                if ( !player.switching )
                    player.switchLayer();
                break;
        }
   }
}

function handleKeyUp( aEvent ) {

    switch ( aEvent.keyCode ) {
        case 38: // up
        case 40: // down
            InputController.cancelVertical( aEvent.keyCode === 38 );
            break;

        case 39: // right
        case 37: // left
            InputController.cancelHorizontal( aEvent.keyCode === 39 );
            break;

        case 32: // spacebar
            player.stopFiring();
            break;
    }
}
