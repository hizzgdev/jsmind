import { describe, expect, test, beforeAll, jest } from '@jest/globals';
import { DataProvider } from '../../src/jsmind.data_provider.js';
import { format } from '../../src/jsmind.format.js';
import { logger } from '../../src/jsmind.common.js';

const mockMind = { mock: true };
const data_provider = new DataProvider({ mind: mockMind });

beforeAll(() => {
    format.node_array.get_mind = jest.fn();
    format.node_array.get_data = jest.fn();
    format.node_tree.get_mind = jest.fn();
    format.node_tree.get_data = jest.fn();
    format.freemind.get_mind = jest.fn();
    format.freemind.get_data = jest.fn();
    logger.error = jest.fn();
});

test('init', () => {
    expect(data_provider.init).toBeDefined();
});

test('reset', () => {
    expect(data_provider.reset).toBeDefined();
});

describe('load', () => {
    test('load node_tree', () => {
        const mockData = { format: 'node_tree' };
        data_provider.load(mockData);
        expect(format.node_tree.get_mind).toBeCalledWith(mockData);
    });
    test('load node_array', () => {
        const mockData = { format: 'node_array' };
        data_provider.load(mockData);
        expect(format.node_array.get_mind).toBeCalledWith(mockData);
    });
    test('load freemind', () => {
        const mockData = { format: 'freemind' };
        data_provider.load(mockData);
        expect(format.freemind.get_mind).toBeCalledWith(mockData);
    });
    test('load non-format', () => {
        const mockData = { data: 'some data' };
        data_provider.load(mockData);
        expect(format.node_tree.get_mind).toBeCalledWith(mockData);
    });
    test('load non-object', () => {
        const mockData = '<xml>';
        data_provider.load(mockData);
        expect(format.freemind.get_mind).toBeCalledWith(mockData);
    });
});

describe('get_data', () => {
    test('get_data node_tree', () => {
        data_provider.get_data('node_tree');
        expect(format.node_tree.get_data).toBeCalledWith(mockMind);
    });
    test('get_data node_array', () => {
        data_provider.get_data('node_array');
        expect(format.node_array.get_data).toBeCalledWith(mockMind);
    });
    test('get_data freemind', () => {
        data_provider.get_data('freemind');
        expect(format.freemind.get_data).toBeCalledWith(mockMind);
    });
    test('get_data unknown data', () => {
        data_provider.get_data('unknown');
        expect(logger.error).toBeCalled();
    });
});
