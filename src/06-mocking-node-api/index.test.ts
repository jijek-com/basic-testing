import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'node:path';
import fs from 'node:fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(999);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 500);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 500);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);
    jest.advanceTimersByTime(1500);
    expect(callback).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  let existsSyncSpy: jest.SpyInstance;
  let readFileSpy: jest.SpyInstance;
  let joinSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    joinSpy?.mockRestore();
    existsSyncSpy?.mockRestore();
    readFileSpy?.mockRestore();
  });

  test('should call join with pathToFile', async () => {
    joinSpy = jest.spyOn(path, 'join');
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    readFileSpy = jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(Buffer.from('content'));

    await readFileAsynchronously('test.txt');
    expect(joinSpy).toHaveBeenCalledWith(__dirname, 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    joinSpy = jest.spyOn(path, 'join');
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    readFileSpy = jest.spyOn(fs.promises, 'readFile');

    const result = await readFileAsynchronously('test.txt');
    expect(result).toBeNull();

    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const content = 'test content';

    joinSpy = jest.spyOn(path, 'join');
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    readFileSpy = jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(Buffer.from(content));

    const result = await readFileAsynchronously('test.txt');
    expect(result).toBe(content);

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
  });
});
