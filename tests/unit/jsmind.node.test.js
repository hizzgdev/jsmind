import { expect, test, jest } from '@jest/globals';
import { Node } from '../../src/jsmind.node.js';

beforeEach(() => {
    jest.restoreAllMocks();
});

test('initial', () => {
    const node = new Node('1', 1, 'topic', null, false, null, 1);
    const expected_node = {
        id: '1',
        index: 1,
        topic: 'topic',
        data: {},
        isroot: false,
        parent: null,
        direction: 1,
        expanded: true,
        children: [],
        _data: {},
    };
    expect(node).toEqual(expected_node);

    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(new Node()).toEqual({});
    expect(new Node('1', '2')).toEqual({});
    expect(new Node('1', 'a')).toEqual({});
    expect(new Node('1', null)).toEqual({});
});

test('compare node', () => {
    function fake_node(sId, iIndex) {
        return new Node(sId, iIndex);
    }

    expect(Node.compare(fake_node('a', 1), fake_node('b', 2))).toBeLessThan(0);
    expect(Node.compare(fake_node('a', 2), fake_node('b', 1))).toBeGreaterThan(0);
    expect(Node.compare(fake_node('a', 2), fake_node('b', 2))).toBe(0);
    expect(Node.compare(fake_node('a', -1), fake_node('b', 2))).toBeGreaterThan(0);
    expect(Node.compare(fake_node('a', 1), fake_node('b', -1))).toBeLessThan(0);
    expect(Node.compare(fake_node('a', -1), fake_node('b', -1))).toBe(0);
    expect(Node.compare(fake_node('a', -5), fake_node('b', -6))).toBe(0);
});

test('inherited node', () => {
    const rootNode = new Node('1', 1, 'root', null, true, null);
    const node11 = new Node('1-1', 1, 'sub node 1', null, false, rootNode);
    const node12 = new Node('1-2', 2, 'sub node 2', null, false, rootNode);
    const node111 = new Node('1-1-1', 1, 'sub sub node 1', null, false, node11);
    expect(Node.inherited(rootNode, node11)).toBe(true);
    expect(Node.inherited(rootNode, node12)).toBe(true);
    expect(Node.inherited(rootNode, node111)).toBe(true);
    expect(Node.inherited(node11, node111)).toBe(true);
    expect(Node.inherited(rootNode, rootNode)).toBe(true);
    expect(Node.inherited(node11, node11)).toBe(true);
    expect(Node.inherited(node11, rootNode)).toBe(false);
    expect(Node.inherited(node11, node12)).toBe(false);
    expect(Node.inherited(node12, node111)).toBe(false);
});

test('get location and size', () => {
    const fakeNode = new Node('1', 1);
    fakeNode._data.view = {
        abs_x: 1,
        abs_y: 2,
        width: 3,
        height: 4,
    };
    expect(fakeNode.get_location()).toEqual({ x: 1, y: 2 });
    expect(fakeNode.get_size()).toEqual({ w: 3, h: 4 });
});

test('check if it is a node', () => {
    const fakeNode = new Node('1', 1);
    expect(Node.is_node({})).toBeFalsy();
    expect(Node.is_node(null)).toBeFalsy();
    expect(Node.is_node()).toBeFalsy();
    expect(Node.is_node('node')).toBeFalsy();
    expect(Node.is_node(fakeNode)).toBeTruthy();
});
