import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: -999999999, b: 999999999, action: Action.Add, expected: 0 },
  {
    a: Number.MAX_SAFE_INTEGER,
    b: 1,
    action: Action.Add,
    expected: 9007199254740992,
  },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: -1000, b: -2000, action: Action.Subtract, expected: 1000 },

  { a: 0, b: 1000, action: Action.Multiply, expected: 0 },
  { a: -3, b: 3, action: Action.Multiply, expected: -9 },
  { a: 99999, b: 99999, action: Action.Multiply, expected: 99999 * 99999 },

  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 1, b: 3, action: Action.Divide, expected: 1 / 3 },
  { a: 5, b: 0, action: Action.Divide, expected: Infinity },

  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 2, b: -2, action: Action.Exponentiate, expected: 0.25 },
];

const invalidCases = [
  { a: '1', b: 2, action: Action.Add },
  { a: 1, b: '2', action: Action.Add },
  { a: '5', b: 2, action: Action.Add },
  { a: null, b: 2, action: Action.Add },
  { a: undefined, b: 2, action: Action.Add },
  { a: undefined, b: 3, action: Action.Subtract, expected: null },
  // { a: NaN, b: 10, action: Action.Multiply, expected: null },
  { a: 4, b: null, action: Action.Divide, expected: null },
  { a: 3, b: 3, action: 'UNKNOWN' as Action, expected: null },
  { a: 1, b: 2, action: '%' },
  { a: 10, b: 5, action: 'divide' },
  { a: 1, b: 2, action: '' },
  { a: 1, b: 2, action: undefined },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should $action $a and $b to equal $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});

describe('simpleCalculator — invalid input', () => {
  test.each(invalidCases)(
    'should return null for invalid input %#',
    (input) => {
      expect(simpleCalculator(input)).toBeNull();
    },
  );
});
