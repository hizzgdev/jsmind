import { describe, expect, test, jest, beforeAll } from '@jest/globals';
import { __version__, logger, EventType } from '../../src/jsmind.common.js';
import { $ } from '../../src/jsmind.dom.js';
import jm from '../../src/jsmind.js';

beforeAll(() => {
    $.c = jest.fn();
    $.g = jest.fn();
    $.on = jest.fn();
    logger.error = jest.fn();
    logger.warn = jest.fn();
    logger.debug = jest.fn();

    const observe = jest.fn();
    const unobserve = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
        observe,
        unobserve,
    }));
});

const mockElement = {
    getContext: jest.fn(),
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
};

test('class alias', () => {
    expect(jm.mind).not.toBeUndefined();
    expect(jm.node).not.toBeUndefined();
    expect(jm.direction).not.toBeUndefined();
    expect(jm.event_type).not.toBeUndefined();
    expect(jm.$).not.toBeUndefined();
    expect(jm.plugin).not.toBeUndefined();
    expect(jm.register_plugin).not.toBeUndefined();
    expect(jm.util).not.toBeUndefined();
});

test('constructor and init', () => {
    $.g.mockReturnValue(mockElement);
    $.c.mockReturnValue(mockElement);
    const jsmind = new jm({ container: 'container' });
    expect(jm.current).toBe(jsmind);
    expect(jsmind.version).toBe(__version__);
    expect(jsmind.initialized).toBeTruthy();
});

test('editable', () => {
    const jsmind = new jm({ container: 'container', editable: false });
    expect(jsmind.get_editable()).toBeFalsy();
    jsmind.enable_edit();
    expect(jsmind.get_editable()).toBeTruthy();
    jsmind.disable_edit();
    expect(jsmind.get_editable()).toBeFalsy();

    const jsmind2 = new jm({ container: 'container', editable: true });
    expect(jsmind2.get_editable()).toBeTruthy();
    jsmind2.disable_edit();
    expect(jsmind2.get_editable()).toBeFalsy();
});

test('begin and end edit', () => {
    const jsmind = create_fake_mind();
    const node = jsmind.get_node('node1');

    jsmind.view.edit_node_begin = jest.fn();
    jsmind.view.edit_node_end = jest.fn();
    jsmind.enable_edit();

    jsmind.begin_edit(node);
    jsmind.end_edit();
    expect(jsmind.view.edit_node_begin).toBeCalledTimes(1);
    expect(jsmind.view.edit_node_end).toBeCalledTimes(1);

    jsmind.begin_edit('node1');
    jsmind.end_edit();
    expect(jsmind.view.edit_node_begin).toBeCalledTimes(2);
    expect(jsmind.view.edit_node_end).toBeCalledTimes(2);

    jsmind.begin_edit('node2');
    jsmind.end_edit();
    expect(jsmind.view.edit_node_begin).toBeCalledTimes(2);
    expect(jsmind.view.edit_node_end).toBeCalledTimes(3);

    jsmind.disable_edit();
    jsmind.begin_edit(node);
    jsmind.end_edit();
    expect(jsmind.view.edit_node_begin).toBeCalledTimes(2);
    expect(jsmind.view.edit_node_end).toBeCalledTimes(4);
});

test('theme', () => {
    const jsmind = new jm({ container: 'container', theme: 'a' });
    jsmind.view.reset_theme = jest.fn();
    jsmind.view.reset_custom_style = jest.fn();
    jsmind.set_theme('b');
    expect(jsmind.view.reset_theme).toBeCalledTimes(1);
    expect(jsmind.view.reset_custom_style).toBeCalledTimes(1);
    jsmind.set_theme('b');
    expect(jsmind.view.reset_theme).toBeCalledTimes(1);
    expect(jsmind.view.reset_custom_style).toBeCalledTimes(1);
    jsmind.set_theme();
    expect(jsmind.view.reset_theme).toBeCalledTimes(2);
    expect(jsmind.view.reset_custom_style).toBeCalledTimes(2);
});

describe('expand & collapse', () => {
    test('test over node', () => {
        const jsmind = create_fake_mind();
        const node = jsmind.get_node('node1');

        jsmind.view.save_location = jest.fn();
        jsmind.view.relayout = jest.fn();
        jsmind.view.restore_location = jest.fn();
        jsmind.layout.toggle_node = jest.fn();
        jsmind.layout.expand_node = jest.fn();
        jsmind.layout.collapse_node = jest.fn();
        jsmind.layout.expand_all = jest.fn();
        jsmind.layout.collapse_all = jest.fn();
        jsmind.layout.expand_to_depth = jest.fn();

        jsmind.toggle_node(node);
        expect(jsmind.view.save_location).toBeCalledTimes(1);
        expect(jsmind.view.relayout).toBeCalledTimes(1);
        expect(jsmind.view.restore_location).toBeCalledTimes(1);
        expect(jsmind.layout.toggle_node).toBeCalledTimes(1);

        jsmind.expand_node(node);
        expect(jsmind.view.save_location).toBeCalledTimes(2);
        expect(jsmind.view.relayout).toBeCalledTimes(2);
        expect(jsmind.view.restore_location).toBeCalledTimes(2);
        expect(jsmind.layout.expand_node).toBeCalledTimes(1);

        jsmind.collapse_node(node);
        expect(jsmind.view.save_location).toBeCalledTimes(3);
        expect(jsmind.view.relayout).toBeCalledTimes(3);
        expect(jsmind.view.restore_location).toBeCalledTimes(3);
        expect(jsmind.layout.collapse_node).toBeCalledTimes(1);

        jsmind.expand_all();
        expect(jsmind.view.relayout).toBeCalledTimes(4);
        expect(jsmind.layout.expand_all).toBeCalledTimes(1);

        jsmind.collapse_all();
        expect(jsmind.view.relayout).toBeCalledTimes(5);
        expect(jsmind.layout.collapse_all).toBeCalledTimes(1);

        jsmind.expand_to_depth(1);
        expect(jsmind.view.relayout).toBeCalledTimes(6);
        expect(jsmind.layout.expand_to_depth).toBeCalledTimes(1);
    });

    test('test over node id', () => {
        const jsmind = create_fake_mind();

        jsmind.view.save_location = jest.fn();
        jsmind.view.relayout = jest.fn();
        jsmind.view.restore_location = jest.fn();
        jsmind.layout.toggle_node = jest.fn();
        jsmind.layout.expand_node = jest.fn();
        jsmind.layout.collapse_node = jest.fn();
        jsmind.layout.expand_all = jest.fn();
        jsmind.layout.collapse_all = jest.fn();
        jsmind.layout.expand_to_depth = jest.fn();

        jsmind.toggle_node('node1');
        expect(jsmind.view.save_location).toBeCalledTimes(1);
        expect(jsmind.view.relayout).toBeCalledTimes(1);
        expect(jsmind.view.restore_location).toBeCalledTimes(1);
        expect(jsmind.layout.toggle_node).toBeCalledTimes(1);

        jsmind.expand_node('node1');
        expect(jsmind.view.save_location).toBeCalledTimes(2);
        expect(jsmind.view.relayout).toBeCalledTimes(2);
        expect(jsmind.view.restore_location).toBeCalledTimes(2);
        expect(jsmind.layout.expand_node).toBeCalledTimes(1);

        jsmind.collapse_node('node1');
        expect(jsmind.view.save_location).toBeCalledTimes(3);
        expect(jsmind.view.relayout).toBeCalledTimes(3);
        expect(jsmind.view.restore_location).toBeCalledTimes(3);
        expect(jsmind.layout.collapse_node).toBeCalledTimes(1);

        jsmind.expand_all();
        expect(jsmind.view.relayout).toBeCalledTimes(4);
        expect(jsmind.layout.expand_all).toBeCalledTimes(1);

        jsmind.collapse_all();
        expect(jsmind.view.relayout).toBeCalledTimes(5);
        expect(jsmind.layout.collapse_all).toBeCalledTimes(1);

        jsmind.expand_to_depth(1);
        expect(jsmind.view.relayout).toBeCalledTimes(6);
        expect(jsmind.layout.expand_to_depth).toBeCalledTimes(1);
    });
});

describe('event handler', () => {
    const mockEvent = { target: { tagName: 'jmnode' } };

    test('mousedown', () => {
        const jsmind = create_fake_mind();

        jsmind.select_node = jest.fn();
        jsmind.select_clear = jest.fn();
        jsmind.view = { get_binded_nodeid: jest.fn(), is_node: jest.fn() };
        jsmind.view.get_binded_nodeid.mockReturnValue('node1');
        jsmind.view.is_node.mockReturnValue(true);

        jsmind.enable_event_handle('mousedown');
        jsmind.mousedown_handle({ target: { tagName: 'jmnode' } });
        expect(jsmind.select_node).toBeCalledWith('node1');
        expect(jsmind.select_clear).toBeCalledTimes(0);

        jsmind.view.is_node.mockReturnValue(false);
        jsmind.mousedown_handle({ target: { tagName: 'DIV' } });
        expect(jsmind.select_node).toBeCalledTimes(1);
        expect(jsmind.select_clear).toBeCalledTimes(0);

        jsmind.view.get_binded_nodeid.mockReturnValue(null);
        jsmind.mousedown_handle({ target: { tagName: 'jmnode' } });
        expect(jsmind.select_node).toBeCalledTimes(1);
        expect(jsmind.select_clear).toBeCalledTimes(1);

        jsmind.view.is_node.mockReturnValue(true);
        jsmind.disable_event_handle('mousedown');
        jsmind.mousedown_handle({ target: { tagName: 'jmnode' } });
        expect(jsmind.select_node).toBeCalledTimes(1);
        expect(jsmind.select_clear).toBeCalledTimes(1);
    });

    test('click', () => {
        const jsmind = create_fake_mind();
        jsmind.view = { is_expander: jest.fn(), get_binded_nodeid: jest.fn() };
        jsmind.toggle_node = jest.fn();

        jsmind.enable_event_handle('click');
        jsmind.view.is_expander.mockReturnValue(true);
        jsmind.view.get_binded_nodeid.mockReturnValue('node1');
        jsmind.click_handle({ target: {} });
        expect(jsmind.toggle_node).toBeCalledWith('node1');

        jsmind.view.is_expander.mockReturnValue(false);
        jsmind.click_handle({ target: {} });
        expect(jsmind.toggle_node).toBeCalledTimes(1);

        jsmind.disable_event_handle('click');
        jsmind.view.is_expander.mockReturnValue(true);
        jsmind.click_handle({ target: {} });
        expect(jsmind.toggle_node).toBeCalledTimes(1);
    });

    test('dblclick', () => {
        const jsmind = create_fake_mind();
        jsmind.get_editable = jest.fn();
        jsmind.begin_edit = jest.fn();
        jsmind.view = { get_binded_nodeid: jest.fn(), is_node: jest.fn() };
        jsmind.view.is_node.mockReturnValue(true);

        jsmind.enable_event_handle('dblclick');
        jsmind.get_editable.mockReturnValue(true);
        jsmind.view.get_binded_nodeid.mockReturnValue('node1');
        jsmind.dblclick_handle({ target: {} });
        expect(jsmind.begin_edit).toBeCalledWith('node1');

        jsmind.view.get_binded_nodeid.mockReturnValue(null);
        jsmind.dblclick_handle({ target: {} });
        expect(jsmind.begin_edit).toBeCalledTimes(1);

        jsmind.get_editable.mockReturnValue(false);
        jsmind.view.get_binded_nodeid.mockReturnValue('node1');
        jsmind.dblclick_handle({ target: {} });
        expect(jsmind.begin_edit).toBeCalledTimes(1);

        jsmind.disable_event_handle('dblclick');
        jsmind.dblclick_handle({ target: {} });
        expect(jsmind.begin_edit).toBeCalledTimes(1);
    });

    test('mousewheel', () => {
        const evt = { preventDefault: jest.fn(), ctrlKey: true };
        const jsmind = create_fake_mind();
        jsmind.view = { zoom_in: jest.fn(), zoom_out: jest.fn() };

        jsmind.enable_event_handle('mousewheel');
        evt.deltaY = 1;
        jsmind.mousewheel_handle(evt);
        expect(jsmind.view.zoom_out).toBeCalledTimes(1);
        expect(jsmind.view.zoom_in).toBeCalledTimes(0);

        evt.deltaY = -1;
        jsmind.mousewheel_handle(evt);
        expect(jsmind.view.zoom_out).toBeCalledTimes(1);
        expect(jsmind.view.zoom_in).toBeCalledTimes(1);

        evt.ctrlKey = false;
        jsmind.mousewheel_handle(evt);
        expect(jsmind.view.zoom_in).toBeCalledTimes(1);
        expect(jsmind.view.zoom_out).toBeCalledTimes(1);

        evt.ctrlKey = true;
        jsmind.disable_event_handle('mousewheel');
        jsmind.mousewheel_handle(evt);
        expect(jsmind.view.zoom_in).toBeCalledTimes(1);
        expect(jsmind.view.zoom_out).toBeCalledTimes(1);
    });
});

test('show mind', () => {
    const jsmind = create_fake_mind();
    jsmind.data = { load: jest.fn(), reset: jest.fn() };
    jsmind.view = { load: jest.fn(), show: jest.fn(), reset: jest.fn() };
    jsmind.layout = { layout: jest.fn(), reset: jest.fn() };
    jsmind.data.load.mockReturnValue({});
    jsmind.invoke_event_handle = jest.fn();

    jsmind.show({ data: 'origin data' });
    expect(jsmind.invoke_event_handle).toBeCalledWith(EventType.show, {
        data: [{ data: 'origin data' }],
    });
});

test('visible check', () => {
    const jsmind = create_fake_mind();
    jsmind.layout = { is_visible: jest.fn() };
    jsmind.layout.is_visible.mockReturnValue(true);
    expect(jsmind.is_node_visible({})).toBe(true);
    expect(jsmind.layout.is_visible).toBeCalledWith({});
});

test('resize', () => {
    const jsmind = create_fake_mind();
    jsmind.view = { resize: jest.fn() };
    jsmind.resize();
    expect(jsmind.view.resize).toBeCalled();
});

describe('get data', () => {
    test('get metadata', () => {
        const jsmind = create_fake_mind();
        jsmind.mind.name = 'jsMind';
        jsmind.mind.author = 'hizzgdev@163.com';
        jsmind.mind.version = 'version';
        expect(jsmind.get_meta()).toEqual({
            name: 'jsMind',
            author: 'hizzgdev@163.com',
            version: 'version',
        });
    });

    test('get data', () => {
        const jsmind = create_fake_mind();
        jsmind.data = { get_data: jest.fn() };
        jsmind.get_data();
        expect(jsmind.data.get_data).toBeCalledWith('node_tree');

        jsmind.get_data('node_array');
        expect(jsmind.data.get_data).toBeCalledWith('node_array');

        jsmind.get_data('freemind');
        expect(jsmind.data.get_data).toBeCalledWith('freemind');
    });

    test('get root', () => {
        const jsmind = new jm({ container: 'container' });
        const mind = new jm.mind();
        const root_node = mind.set_root('root', 'root');
        jsmind.mind = mind;
        expect(jsmind.get_root()).toBe(root_node);
    });

    test('get node', () => {
        const jsmind = new jm({ container: 'container' });
        const mind = new jm.mind();
        const root_node = mind.set_root('root', 'root');
        const node = mind.add_node(root_node, 'node1', 'node1');
        jsmind.mind = mind;
        expect(jsmind.get_node('node1')).toBe(node);
    });
});

describe('data mutation', () => {
    function mock_jsmind(jsmind) {
        jsmind.enable_edit();
        jsmind.layout = {
            calculate_next_child_direction: jest.fn(),
            layout: jest.fn(),
            expand_node: jest.fn(),
        };
        jsmind.view = {
            add_node: jest.fn(),
            show: jest.fn(),
            reset_node_custom_style: jest.fn(),
            save_location: jest.fn(),
            expand_node: jest.fn(),
            relayout: jest.fn(),
            restore_location: jest.fn(),
            remove_node: jest.fn(),
            update_node: jest.fn(),
        };
        return jsmind;
    }

    test('add node', () => {
        const jsmind = mock_jsmind(create_fake_mind());

        jsmind.add_node('node1', 'node2', 'node2');
        const node1 = jsmind.get_node('node1');
        expect(jsmind.layout.calculate_next_child_direction).toBeCalledWith(node1);
        expect(jsmind.view.add_node).toBeCalled();
        const node2 = jsmind.get_node('node2');
        expect(node2.parent).toBe(node1);
        expect(node2.topic).toBe('node2');
    });

    test('insert node before', () => {
        const jsmind = mock_jsmind(create_fake_mind());

        jsmind.insert_node_before('node1', 'node2', 'node2');
        const root = jsmind.get_root();
        const node1 = jsmind.get_node('node1');
        const node2 = jsmind.get_node('node2');
        expect(node2.parent).toBe(root);
        expect(root.children[0]).toBe(node2);
        expect(root.children[1]).toBe(node1);
    });

    test('insert node after', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        jsmind.insert_node_after('node1', 'node2', 'node2');
        const root = jsmind.get_root();
        const node1 = jsmind.get_node('node1');
        const node2 = jsmind.get_node('node2');
        expect(node2.parent).toBe(root);
        expect(root.children[0]).toBe(node1);
        expect(root.children[1]).toBe(node2);
    });

    test('remove node', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        jsmind.remove_node('node1');
        expect(jsmind.get_node('node1')).toBeNull();
    });

    test('update node', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        jsmind.update_node('node1', 'node1 new topic');
        expect(jsmind.get_node('node1').topic).toBe('node1 new topic');
    });

    test('move node', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        jsmind.insert_node_after('node1', 'node2', 'node2');
        jsmind.move_node('node2', 'node1', 'root');
        const root = jsmind.get_root();
        const node1 = jsmind.get_node('node1');
        const node2 = jsmind.get_node('node2');
        expect(node2.parent).toBe(root);
        expect(root.children[0]).toBe(node2);
        expect(root.children[1]).toBe(node1);
    });

    test('find node', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        jsmind.insert_node_after('node1', 'node2', 'node2');
        const node1 = jsmind.get_node('node1');
        const node2 = jsmind.get_node('node2');
        expect(jsmind.find_node_before('node1')).toBeNull();
        expect(jsmind.find_node_before('node2')).toBe(node1);
        expect(jsmind.find_node_after('node2')).toBeNull();
        expect(jsmind.find_node_after('node1')).toBe(node2);
    });
});

test('select node', () => {
    const jsmind = create_fake_mind();
    jsmind.layout = { is_visible: jest.fn() };
    jsmind.view = { select_node: jest.fn(), select_clear: jest.fn() };
    jsmind.layout.is_visible.mockReturnValue(true);
    jsmind.select_node('node1');
    const node1 = jsmind.get_node('node1');
    expect(jsmind.get_selected_node()).toBe(node1);
    jsmind.select_clear();
    expect(jsmind.get_selected_node()).toBeNull;
});

describe('style', () => {
    function mock_jsmind(jsmind) {
        jsmind.enable_edit();
        jsmind.layout = {
            layout: jest.fn(),
        };
        jsmind.view = {
            reset_node_custom_style: jest.fn(),
            update_node: jest.fn(),
            show: jest.fn(),
        };
        return jsmind;
    }
    test('node color', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        const node = jsmind.get_node('node1');
        jsmind.set_node_color('node1', 'bgcolor', 'fgcolor');
        expect(node.data['background-color']).toBe('bgcolor');
        expect(node.data['foreground-color']).toBe('fgcolor');
    });
    test('node font style', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        const node = jsmind.get_node('node1');
        jsmind.set_node_font_style('node1', 'size', 'weight', 'style');
        expect(node.data['font-size']).toBe('size');
        expect(node.data['font-weight']).toBe('weight');
        expect(node.data['font-style']).toBe('style');
    });
    test('background image', () => {
        const jsmind = mock_jsmind(create_fake_mind());
        const node = jsmind.get_node('node1');
        jsmind.set_node_background_image('node1', 'image', 'width', 'height', 'rotation');
        expect(node.data['background-image']).toBe('image');
        expect(node.data['width']).toBe('width');
        expect(node.data['height']).toBe('height');
        expect(node.data['background-rotation']).toBe('rotation');

        jsmind.set_node_background_rotation('node1', 'new rotation');
        expect(node.data['background-rotation']).toBe('new rotation');
    });
});

test('event listener', () => {
    const jsmind = create_fake_mind();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    $.w.setTimeout = (fn, timeout) => fn();

    jsmind.add_event_listener(callback1);
    jsmind.clear_event_listener();
    jsmind.add_event_listener(callback2);
    jsmind.add_event_listener(callback3);

    jsmind.invoke_event_handle('a', 'b');
    expect(callback1).toBeCalledTimes(0);
    expect(callback2).toBeCalledWith('a', 'b');
    expect(callback3).toBeCalledWith('a', 'b');
});

function create_fake_mind() {
    const jsmind = new jm({ container: 'container' });
    const mind = new jm.mind();
    const root_node = mind.set_root('root', 'root');
    mind.add_node(root_node, 'node1', 'node1');
    jsmind.mind = mind;
    return jsmind;
}
