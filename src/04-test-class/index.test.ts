import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(0).getBalance()).toBe(0);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const acc = getBankAccount(100);
    expect(() => acc.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const acc1 = getBankAccount(100);
    const acc2 = getBankAccount(0);
    expect(() => acc1.transfer(200, acc2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const acc = getBankAccount(100);
    expect(() => acc.transfer(10, acc)).toThrow(Error);
  });

  test('should deposit money', () => {
    const acc = getBankAccount(100);
    acc.deposit(10);
    expect(acc.getBalance()).toBe(110);
  });

  test('should withdraw money', () => {
    const acc = getBankAccount(100);
    acc.withdraw(50);
    expect(acc.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const acc1 = getBankAccount(100);
    const acc2 = getBankAccount(0);
    acc1.transfer(50, acc2);
    expect(acc1.getBalance()).toBe(50);
    expect(acc2.getBalance()).toBe(50);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const acc = getBankAccount(100);

    const result = await acc.fetchBalance();
    expect(result === null || typeof result === 'number').toBe(true);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const acc = getBankAccount(100);

    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(200);
    await acc.synchronizeBalance();
    expect(acc.getBalance()).toBe(200);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const acc = getBankAccount(100);

    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(null);
    await expect(acc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
