const jm = require('../js/jsmind');

beforeEach(() => {
    jest.restoreAllMocks();
});

test('initial', () => {
    const mind = new jm.mind();
    expect(new jm.mind()).toEqual({
        name: null,
        author: null,
        version: null,
        root: null,
        selected: null,
        nodes: {}
    })
});

test('get node', () => {
    const mind = new jm.mind();
    const fake_node = new jm.node('1', 1);
    mind.nodes = { '1': fake_node }
    expect(mind.get_node('1')).toBe(fake_node)

    jest.spyOn(console, "warn").mockImplementation(() => { });
    expect(mind.get_node('2')).toBe(null)
});

test('set root', () => {
    const mind = new jm.mind();
    mind.set_root('1', 'root', { 'addition': 'test' });
    const root_node = new jm.node('1', 0, 'root', { 'addition': 'test' }, true);
    expect(mind).toEqual({
        name: null,
        author: null,
        version: null,
        root: root_node,
        selected: null,
        nodes: { '1': root_node }
    });
    jest.spyOn(console, "warn").mockImplementation(() => { });
    expect(mind.get_node('2')).toBe(null)
});

test('add 2nd level node', () => {
    const mind = new jm.mind();
    const root = mind.set_root('1', 'root');
    const node2 = mind.add_node(root, '2', 'node2', { 'addition': 'test 2' })
    const node3 = mind.add_node(root, '3', 'node3', { 'addition': 'test 3' }, jm.direction.left)
    const node4 = mind.add_node(root, '4', 'node4')

    expect(mind.get_node('1')).toBe(root)
    expect(mind.get_node('2')).toBe(node2)
    expect(mind.get_node('3')).toBe(node3)
    expect(mind.get_node('4')).toBe(node4)

    expect(node2).toEqual({
        id: '2',
        index: 1,
        topic: 'node2',
        data: {'addition': 'test 2'},
        isroot: false,
        parent: root,
        direction: jm.direction.right,
        expanded: true,
        children: [],
        _data: {}
    });
    expect(node3).toEqual({
        id: '3',
        index: 2,
        topic: 'node3',
        data: {'addition': 'test 3'},
        isroot: false,
        parent: root,
        direction: jm.direction.left,
        expanded: true,
        children: [],
        _data: {}
    });
    expect(node4).toEqual({
        id: '4',
        index: 3,
        topic: 'node4',
        data: {},
        isroot: false,
        parent: root,
        direction: jm.direction.right,
        expanded: true,
        children: [],
        _data: {}
    });
    expect(node2.index).toBe(1)
    expect(node3.index).toBe(2)
    expect(node4.index).toBe(3)

    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
    expect(mind.add_node('100')).toBe(null)

});
