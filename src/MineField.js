'use strict'

class MineField {
    constructor(settings, moviments) {
        this.settings = settings;
        this.moviments = moviments;
        this.directions = [ 'North', 'East', 'South', 'West' ];
        this.turtlePosition = { x: 1, y: 1, direction: 'North' };
    }

    validate() {
        if (!this.settings)
            throw Error('Please, provide a valid initialSettings.json file');
        if (!this.settings.field || !this.settings.field.x || !this.settings.field.y)
            throw Error('Please, setup a "field" property');
        if (!this.settings.turtleStartPosition || !this.settings.turtleStartPosition.x || !this.settings.turtleStartPosition.y || !this.settings.turtleStartPosition.direction)
            throw Error('Please, setup a "turtleStartPosition" property');
        if (!this.settings.exitPoint || !this.settings.exitPoint.x || !this.settings.exitPoint.y)
            throw Error('Please, setup a "exitPoint" property');
        if (!this.directions.includes(this.settings.turtleStartPosition.direction))
            throw Error('Available values for directions: North, East, South, West');
        if (!this.moviments)
            throw Error('Please, provide a valid turtleMoviments.json file');
        
        this.turtlePosition = { ...this.settings.turtleStartPosition };
    }

    startGame() {
        this.validate();

        for (const moviment of this.moviments) {
            try {
                this.move(moviment);
                
                // checking out our freedom
                if (this.turtlePosition.x === this.settings.exitPoint.x && this.turtlePosition.y === this.settings.exitPoint.y) {
                    console.log(`WOHOO, CONGRATS \\o/ - YOU'RE FREE`);
                    return;
                }
            } catch (ex) {
                // Something happened =(
                console.log(ex.message);
                break;
            }
        }
    }

    move(moviment) {
        moviment = moviment.toString().toLowerCase();
        if (moviment != 'r' && moviment != 'm')
            throw Error("You're just allowed to move foward (command 'm') or turn right your position (command 'r')");

        // moviment 'R', just turn right slowly and carefully
        if (moviment === 'r')
            return this.setNewTurtleDirection();

        // Command 'M', let's walk
        this.setNewTurtleCoordinates();
        this.checkOutOfBounds();
        this.checkMineColision();

        console.log(`MOVING TO: X: ${this.turtlePosition.x}, Y: ${this.turtlePosition.y}, DIR: ${this.turtlePosition.direction}`, this.checkProximityWithMine() ? `- WATCH OUT, YOU'RE IN DANGER` : '');
    }

    setNewTurtleDirection() {
        const currentDirection = this.directions.indexOf(this.turtlePosition.direction);
	    this.turtlePosition.direction = this.directions[currentDirection + 1] || this.directions[0];
    }

    setNewTurtleCoordinates() {
        switch (this.turtlePosition.direction) {
            case 'North': 
                return this.turtlePosition.y--;
            case 'South':
                return this.turtlePosition.y++;
            case 'East':
                return this.turtlePosition.x++;
            case 'West':
                return this.turtlePosition.x--;
        }
    }

    checkMineColision() {
        if (this.settings.mines) {
            const mine = this.settings.mines.find(mine => mine.x === this.turtlePosition.x && mine.y === this.turtlePosition.y);
            if (mine) {
                throw Error(`OH, NO! YOU BLEW UP: X: ${mine.x}, Y: ${mine.y}`);
            }
        }
    }

    checkProximityWithMine() {
        if (this.settings.mines) {
            // Checking mines around current position
            const possibleColisions = this.settings.mines.find(mine => 
                (mine.y === this.turtlePosition.y - 1 && mine.x === this.turtlePosition.x) ||
                (mine.y === this.turtlePosition.y + 1 && mine.x === this.turtlePosition.x) ||
                (mine.y === this.turtlePosition.y && mine.x === this.turtlePosition.x - 1) ||
                (mine.y === this.turtlePosition.y && mine.x === this.turtlePosition.x + 1)
            );

            if (possibleColisions)
                return true;
        }

        return false;
    }

    checkOutOfBounds() {
        if (this.turtlePosition.x > this.settings.field.x || this.turtlePosition.x <= 0 || this.turtlePosition.y > this.settings.field.y || this.turtlePosition.y <= 0)
            throw Error('ARE YOU FEAR? YOU RAN OUT OF BOUNDS!!');
    }
}

module.exports = MineField;