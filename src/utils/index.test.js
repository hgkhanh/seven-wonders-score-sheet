import * as utils from './';

describe('Utils test', () => {
    describe('generateRoomCode()', () => {
        it('Generate 4 digit code with empty exclusion array', () => {
            const digit = 4;
            const exclude = [];
            expect(utils.generateRoomCode(digit, exclude).length).toEqual(4);
        });

        it('Generate 1 digit code with exclusion array of 5', () => {
            const digit = 1;
            const exclude = ['1', '3', '2', '4', '9'];
            const result = utils.generateRoomCode(digit, exclude);
            expect(result.length).toEqual(1);
            expect(exclude).not.toContain(result);
        });
    });
});
