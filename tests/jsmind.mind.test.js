const jm = require('../js/jsmind');

test('create mind', () => {
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

test('set root', () => {
    const mind = new jm.mind();
    mind.set_root('1', 'root', { 'addition': 'test' });
    const root_node = new jm.node('1', 0, 'root', { 'addition': 'test' }, true);
    const expect_mind = {
        name: null,
        author: null,
        version: null,
        root: root_node,
        selected: null,
        nodes: { '1': root_node }
    }
    expect(mind).toEqual(expect_mind);
})