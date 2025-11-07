import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const res = simpleCalculator({ action: Action.Add, a: 1, b: 2 });
    expect(res).toBe(3);
  });

  test('should subtract two numbers', () => {
    const res = simpleCalculator({ action: Action.Subtract, a: 1, b: 2 });
    expect(res).toBe(-1);
  });

  test('should multiply two numbers', () => {
    const res = simpleCalculator({ action: Action.Multiply, a: 1, b: 2 });
    expect(res).toBe(2);
  });

  test('should divide two numbers', () => {
    const res = simpleCalculator({ action: Action.Divide, a: 1, b: 2 });
    expect(res).toBe(0.5);
  });

  test('should exponentiate two numbers', () => {
    const res = simpleCalculator({ action: Action.Exponentiate, a: 2, b: 2 });
    expect(res).toBe(4);
  });

  test('should return null for invalid action', () => {
    const res = simpleCalculator({ action: ',', a: 5, b: 2 });
    expect(res).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const res = simpleCalculator({ action: Action.Add, a: '', b: 2 });
    expect(res).toBeNull();
  });
});
