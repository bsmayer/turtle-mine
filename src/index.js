'use strict';

const settings = require('./config/initialSettings.json');
const moviments = require('./config/turtleMoviments.json');
const MineField = require('./MineField');

new MineField(settings, moviments).startGame();


