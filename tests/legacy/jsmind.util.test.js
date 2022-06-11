const jm = require('./jsmind.versions');

test('json serialization', () => {
    const jsonObject = { name: 'jsMind' };
    const jsonString = '{"name":"jsMind"}';

    expect(jm.util.json.json2string(jsonObject)).toEqual(jsonString);
    expect(jm.util.json.string2json(jsonString)).toEqual(jsonObject);
});

test('json merge', () => {
    const o1 = { name: 'jsMind', license: 'BSD' };
    const o2 = { name: 'jsMind ES6', lang: 'ES6' };
    const o3 = jm.util.json.merge({}, o1);
    const o4 = jm.util.json.merge(o3, o2);
    const o5 = jm.util.json.merge({}, o4);

    expect(o3).toBe(o4);
    expect(o4).toEqual({ name: 'jsMind ES6', lang: 'ES6', license: 'BSD' });
    expect(o5).toEqual(o4);
    expect(jm.util.json.merge(o5, {})).toEqual(o4);
});

test('uuid newid', () => {
    const uuid1 = jm.util.uuid.newid();
    const uuid2 = jm.util.uuid.newid();
    expect(uuid1 === uuid2).toBeFalsy();
    expect(uuid1.length).toBe(16);
});

test('string is empty', () => {
    expect(jm.util.text.is_empty()).toBeTruthy();
    expect(jm.util.text.is_empty(null)).toBeTruthy();
    expect(jm.util.text.is_empty('')).toBeTruthy();
    expect(jm.util.text.is_empty('\n\t\r ')).toBeTruthy();
    expect(jm.util.text.is_empty(' hello ')).toBeFalsy();
    expect(jm.util.text.is_empty('hello world')).toBeFalsy();
});
