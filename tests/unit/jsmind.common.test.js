import {
    __author__,
    __version__,
    logger,
    Direction,
    EventType,
    Key,
    LogLevel,
} from '../../src/jsmind.common.js';

test('test exported elements', () => {
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.log).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(Direction.left).toBe(-1);
    expect(Direction.center).toBe(0);
    expect(Direction.right).toBe(1);
    expect(EventType.show).toBe(1);
    expect(EventType.resize).toBe(2);
    expect(EventType.edit).toBe(3);
    expect(EventType.select).toBe(4);
    expect(Direction.center).toBe(0);
    expect(Key.meta).toBe(1 << 13);
    expect(Key.ctrl).toBe(1 << 12);
    expect(Key.alt).toBe(1 << 11);
    expect(Key.shift).toBe(1 << 10);
    expect(LogLevel.debug).toBe(1);
    expect(LogLevel.info).toBe(2);
    expect(LogLevel.warn).toBe(3);
    expect(LogLevel.error).toBe(4);
    expect(LogLevel.disable).toBe(9);
});
