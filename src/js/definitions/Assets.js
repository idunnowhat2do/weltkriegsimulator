/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2017 - http://www.igorski.nl
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

const Config    = require( "../config/Config" );
const assetRoot = Config.getBaseURL() + "assets/";

const Assets = module.exports = {

    GRAPHICS: {
        POWERUP      : `${assetRoot}images/sprites/spritesheet_powerups.png`,
        SHIP         : `${assetRoot}images/sprites/spritesheet_ship.png`,
        BOSS         : `${assetRoot}images/sprites/spritesheet_boss.png`,
        FX           : `${assetRoot}images/sprites/spritesheet_fx.png`,
        SKY          : `${assetRoot}images/sprites/clouds.png`,
        BULLET       : `${assetRoot}images/sprites/bullet.png`,
        TILE         : `${assetRoot}images/sprites/tile.png`
    },

    AUDIO: {
        AU_EXPLOSION : `${assetRoot}sounds/explosion.mp3`,
        AU_LASER     : `${assetRoot}sounds/laser.mp3`
    }
};
