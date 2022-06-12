import { expect, test } from '@jest/globals';
import { $ } from '../../src/jsmind.dom.js';

test('members', () => {
    expect($.w).toBeDefined();
    expect($.d).toBeDefined();
    expect($.g).toBeDefined();
    expect($.c).toBeDefined();
    expect($.t).toBeDefined();
    expect($.h).toBeDefined();
    expect($.i).toBeDefined();
    expect($.on).toBeDefined();
});
