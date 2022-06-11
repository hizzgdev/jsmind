import { expect, test, jest } from '@jest/globals';
import { Mind } from '../../src/jsmind.mind.js';
import { Node } from '../../src/jsmind.node.js';
import { Direction } from '../../src/jsmind.common.js';

beforeEach(() => {
    jest.restoreAllMocks();
});

test('initial', () => {
    const mind = new Mind();
    expect(mind).toEqual({
        name: null,
        author: null,
        version: null,
        root: null,
        selected: null,
        nodes: {},
    });
});

test('get node', () => {
    const mind = new Mind();
    const fake_node = new Node('1', 1);
    mind.nodes = { 1: fake_node };
    expect(mind.get_node('1')).toBe(fake_node);

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(mind.get_node('2')).toBe(null);
});

test('set root', () => {
    const mind = new Mind();
    mind.set_root('1', 'root', { addition: 'test' });
    const root_node = new Node('1', 0, 'root', { addition: 'test' }, true);
    expect(mind).toEqual({
        name: null,
        author: null,
        version: null,
        root: root_node,
        selected: null,
        nodes: { 1: root_node },
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(mind.get_node('2')).toBe(null);
});

test('add node', () => {
    const mind = new Mind();
    const root = mind.set_root('1', 'root');
    const node2 = mind.add_node(root, '2', 'node2', { addition: 'test 2' });
    const node3 = mind.add_node(root, '3', 'node3', { addition: 'test 3' }, Direction.left);
    const node4 = mind.add_node(root, '4', 'node4');

    expect(mind.get_node('1')).toBe(root);
    expect(mind.get_node('2')).toBe(node2);
    expect(mind.get_node('3')).toBe(node3);
    expect(mind.get_node('4')).toBe(node4);

    expect(node2).toEqual({
        id: '2',
        index: 1,
        topic: 'node2',
        data: { addition: 'test 2' },
        isroot: false,
        parent: root,
        direction: Direction.right,
        expanded: true,
        children: [],
        _data: {},
    });
    expect(node3).toEqual({
        id: '3',
        index: 2,
        topic: 'node3',
        data: { addition: 'test 3' },
        isroot: false,
        parent: root,
        direction: Direction.left,
        expanded: true,
        children: [],
        _data: {},
    });
    expect(node4).toEqual({
        id: '4',
        index: 3,
        topic: 'node4',
        data: {},
        isroot: false,
        parent: root,
        direction: Direction.right,
        expanded: true,
        children: [],
        _data: {},
    });
    expect(node2.index).toBe(1);
    expect(node3.index).toBe(2);
    expect(node4.index).toBe(3);

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(mind.add_node('100')).toBe(null);
});

test('insert node before/after', () => {
    const mind = new Mind();
    const root = mind.set_root('0', 'root');
    const node1 = mind.add_node(root, '1', 'node1');
    expect(node1.index).toBe(1);
    const node_a = mind.insert_node_before(node1, '2', 'node2');
    expect(node_a.index).toBe(1);
    expect(node1.index).toBe(2);
    const node_b = mind.insert_node_after(node1, '3', 'node3');
    expect(node_a.index).toBe(1);
    expect(node1.index).toBe(2);
    expect(node_b.index).toBe(3);
});

test('get node before/after', () => {
    const mind = new Mind();
    const root = mind.set_root('0', 'root');
    const node1 = mind.add_node(root, '1', 'node1');
    const node2 = mind.add_node(root, '2', 'node2');
    const node3 = mind.add_node(root, '3', 'node3');
    expect(mind.get_node_before(node1)).toBe(null);
    expect(mind.get_node_before(node2)).toBe(node1);
    expect(mind.get_node_before(node3)).toBe(node2);
    expect(mind.get_node_after(node1)).toBe(node2);
    expect(mind.get_node_after(node2)).toBe(node3);
    expect(mind.get_node_after(node3)).toBe(null);
});

test('move node', () => {
    const mind = new Mind();
    const root = mind.set_root('0', 'root');
    const node1 = mind.add_node(root, '1', 'node1', null);
    const node2 = mind.add_node(root, '2', 'node2', null);
    const node3 = mind.add_node(root, '3', 'node3', null);

    mind.move_node(node3, node2.id);
    expect(mind.get_node_after(node1)).toBe(node3);
    expect(mind.get_node_after(node3)).toBe(node2);

    mind.move_node(node3, '_first_');
    expect(mind.get_node_after(node3)).toBe(node1);
    expect(mind.get_node_before(node3)).toBe(null);

    mind.move_node(node3, '_last_');
    expect(mind.get_node_before(node3)).toBe(node2);
    expect(mind.get_node_after(node3)).toBe(null);

    mind.move_node(node3, '_last_', node1.id);
    expect(node3.parent).toBe(node1);
    expect(root.children.length).toBe(2);
    expect(node1.children[0]).toBe(node3);

    mind.move_node(node2, '_first_', node1.id);
    expect(node2.parent).toBe(node1);
    expect(root.children.length).toBe(1);
    expect(node1.children[0]).toBe(node2);
    expect(node1.children[1]).toBe(node3);

    jest.spyOn(console, 'error').mockImplementation(() => {});
    mind.move_node(node1, '_first_', node2.id);
    expect(node1.parent).toBe(root);
    expect(node2.children.length).toBe(0);
});

test('remove node', () => {
    const mind = new Mind();
    const root = mind.set_root('0', 'root');
    const node1 = mind.add_node(root, '1', 'node1', null);
    const node2 = mind.add_node(node1, '2', 'node2', null);
    const node3 = mind.add_node(node2, '3', 'node3', null);
    mind.selected = node3;

    jest.spyOn(console, 'error').mockImplementation(() => {});
    mind.remove_node(root);
    expect(mind.get_node('0')).toBe(root);
    mind.remove_node(node1);
    expect(root.children.length).toBe(0);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(mind.get_node('1')).toBe(null);
    expect(mind.get_node('2')).toBe(null);
    expect(mind.get_node('3')).toBe(null);
    expect(mind.selected).toBe(null);
});
