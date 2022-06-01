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