const chai = require('chai');
const MineField = require('../src/MineField');

const expect = chai.expect;
let settings = {};
let moviments = [];

beforeEach(() => {
    settings = {
        field: { x: 10, y: 10 },
        mines: [
            { x: 3, y: 4 },
            { x: 8, y: 8 }
        ],
        exitPoint: { x: 5, y: 5 },
        turtleStartPosition: { x: 1, y: 10, direction: 'North' }
    };

    moviments = [ 'm', 'm', 'm', 'r' ];
});

/**
 * SOME SIMPLE TESTS
 */
describe('MineField Test Results', () => {
    it('should not start the game if there are properties missing', () => {
        expect(() => new MineField(null, null).startGame()).to.throw();
    });

    it('should not start the game if field settings is mssing', () => {
        expect(() => new MineField({}, null).startGame()).to.throw();
    });

    it('should turn the turtle to East', () => {
        const mineField = new MineField(settings, moviments);
        mineField.setNewTurtleDirection();
        expect(mineField.turtlePosition.direction).to.equal('East');
    });

    it('should move forward', () => {
        const mineField = new MineField(settings, moviments);
        mineField.turtlePosition = { ...settings.turtleStartPosition };
        mineField.setNewTurtleCoordinates();
        expect(mineField.turtlePosition.y).equal(9);
    });
});