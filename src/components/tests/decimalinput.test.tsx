import { processInputValue } from '../DecimalInput';

describe('processInputValue Functionality', () => {
    test('decimal is inserted when started with two zeros', () => {
        const input = '00';
        const output = processInputValue(input);
        expect(output).toBe('0.0');
    });


    test('should return period when given period bc it fails regex test', () => {
        const input = '.01';
        const output = processInputValue(input);
        expect(output).toBe('.01');
    });

    test('should handle long string inputs without hanging or crashing', () => {
        const longInput = '0.'.padEnd(10000, '0');
        const start = performance.now();
        const output = processInputValue(longInput);
        const end = performance.now();
        expect(output).toBe(longInput);
        expect(end - start).toBeLessThan(1000);
    });

    test('should handle long string inputs without hanging or crashing ex 2', () => {
        const longInput = 'asdfasslajdlSFSJ;DSLJDSASFd'.padEnd(10000, '0');
        const start = performance.now();
        const output = processInputValue(longInput);
        const end = performance.now();
        expect(output).toBe(longInput);
        expect(end - start).toBeLessThan(1000);
    });


    test('should not allow random characters to pass regex test', () => {
        const input = 'asdasknelfawleargraaragjklrgnargl';
        const output = processInputValue(input);
        expect(output).toBe(input);
    });
});
