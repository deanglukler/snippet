import splitStringInclusive from './splitStringInclusive';

describe('splitStringInclusive', () => {
  it('should split a string by a delimiter and include the delimiter in the result', () => {
    const str = 'hello,world';
    const split = ',';
    const result = splitStringInclusive(str, split);
    expect(result).toEqual(['hello', ',', 'world']);
  });

  it('should split a string by a delimiter and include the delimiter in the result, round 2', () => {
    const str = 'hello large world';
    const split = 'large';
    const result = splitStringInclusive(str, split);
    expect(result).toEqual(['hello ', 'large', ' world']);
  });

  it('should return an array with the original string if the delimiter is not found', () => {
    const str = 'hello world';
    const split = ',';
    const result = splitStringInclusive(str, split);
    expect(result).toEqual([str]);
  });

  it('should return an empty array if the input string is empty', () => {
    const str = '';
    const split = ',';
    const result = splitStringInclusive(str, split);
    expect(result).toEqual([]);
  });
});
