import utils from './utils';

describe('replaceString(str, rep, pos)', () => {
    it('should replace the string at position \'pos\' with \'rep\'', () => {
        const initString = 'Hello World!';
        const modifiedString = 'Hello World?';

        expect(utils.replaceString(initString, '?', 11)).toEqual(modifiedString);
    });
});

describe('toProperCase(name)', () => {
    it('should return the string in Proper Case', () => {
        const testString = 'this is a sentance with an_undescore';
        const properCase = 'This Is A Sentance With An_Undescore';

        expect(utils.toProperCase(testString)).toEqual(properCase);
    });
});
