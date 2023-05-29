import { expect, test, jest } from '@jest/globals';
import { Plugin, register, apply } from '../../src/jsmind.plugin.js';

test('register and apply plugins', async () => {
    const plugin1_fn_init = jest.fn();
    const plugin2_fn_init = jest.fn();

    const plugin1 = new Plugin('a', plugin1_fn_init);
    const plugin2 = new Plugin('b', plugin2_fn_init);

    register(plugin1);
    register(plugin2);

    const mock_jm = { jm: 'mock' };
    const mock_options = {
        a: {
            a: 'A',
        },
        b: {
            b: 'B',
        },
    };
    apply(mock_jm, mock_options);

    await new Promise(r => setTimeout(r, 10));
    expect(plugin1_fn_init).toBeCalledWith(mock_jm, mock_options.a);
    expect(plugin2_fn_init).toBeCalledWith(mock_jm, mock_options.b);
});

test('constructor invalid plugins', () => {
    expect(() => {
        new Plugin();
    }).toThrow(new Error('plugin must has a name'));
    expect(() => {
        new Plugin(null);
    }).toThrow(new Error('plugin must has a name'));
    expect(() => {
        new Plugin('', {});
    }).toThrow(new Error('plugin must has a name'));
    expect(() => {
        new Plugin('a');
    }).toThrow(new Error('plugin must has an init function'));
    expect(() => {
        new Plugin('a', {});
    }).toThrow(new Error('plugin must has an init function'));
});

test('register invalid plugins', () => {
    expect(() => {
        register({});
    }).toThrow(new Error('can not register plugin, it is not an instance of Plugin'));
    expect(() => {
        register('a');
    }).toThrow(new Error('can not register plugin, it is not an instance of Plugin'));

    const mock_fn_init = jest.fn();

    const plugin1 = new Plugin('x', mock_fn_init);
    const plugin2 = new Plugin('x', mock_fn_init);

    register(plugin1);
    expect(() => {
        register(plugin2);
    }).toThrow(new Error('can not register plugin x: plugin name already exist'));
});
