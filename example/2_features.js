var _jm = null;
function open_empty() {
    // jsMind实例已在HTML中初始化，这里只需要确保存在
    if (!window._jm) {
        var options = {
            container: 'jsmind_container',
            theme: 'greensea',
            editable: true,
            enable_multiline: true, // 默认关闭多行编辑以保持兼容性
            log_level: 'debug',
            view: {
                engine: 'canvas',
                draggable: true,
                enable_device_pixel_ratio: false,
            },
            plugin: {
                screenshot: {
                    background: '#ffffff',
                },
            },
        };
        _jm = new jsMind(options);
        _jm.show();
    } else {
        _jm = window._jm;
    }
}

function open_json() {
    var mind = {
        meta: {
            name: 'jsMind remote',
            author: 'hizzgdev@163.com',
            version: '0.2',
        },
        format: 'node_tree',
        data: {
            id: 'root',
            topic: 'jsMind',
            children: [
                {
                    id: 'easy',
                    topic: 'Easy',
                    direction: 'left',
                    children: [
                        { id: 'easy1', topic: 'Easy to show' },
                        { id: 'easy2', topic: 'Easy to edit' },
                        { id: 'easy3', topic: 'Easy to store' },
                        { id: 'easy4', topic: 'Easy to embed' },
                        {
                            'id': 'other3',
                            'background-image': 'ant.png',
                            'width': '100',
                            'height': '100',
                        },
                    ],
                },
                {
                    id: 'open',
                    topic: 'Open Source',
                    direction: 'right',
                    children: [
                        {
                            'id': 'open1',
                            'topic': 'on GitHub',
                            'background-color': '#eee',
                            'foreground-color': 'blue',
                        },
                        { id: 'open2', topic: 'BSD License' },
                    ],
                },
                {
                    id: 'powerful',
                    topic: 'Powerful',
                    direction: 'right',
                    children: [
                        { id: 'powerful1', topic: 'Base on Javascript' },
                        { id: 'powerful2', topic: 'Base on HTML5' },
                        { id: 'powerful3', topic: 'Depends on you' },
                    ],
                },
                {
                    id: 'other',
                    topic: 'test node',
                    direction: 'left',
                    children: [
                        { id: 'other1', topic: "I'm from local variable" },
                        { id: 'other2', topic: 'I can do everything' },
                    ],
                },
            ],
        },
    };
    _jm.show(mind);
}

function open_remote() {
    fetch('data_example.json')
        .then(resp => resp.json())
        .then(mind => _jm.show(mind));
}

function screen_shot() {
    _jm.shoot();
}

function show_data() {
    var mind_data = _jm.get_data();
    var mind_string = jsMind.util.json.json2string(mind_data);
    prompt_info(mind_string);
}

function save_file() {
    var mind_data = _jm.get_data();
    var mind_name = mind_data.meta.name;
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str, 'text/jsmind', mind_name + '.jm');
}

function open_file() {
    var file_input = document.getElementById('file_input');
    var files = file_input.files;
    if (files.length > 0) {
        var file_data = files[0];
        jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
            var mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                _jm.show(mind);
            } else {
                prompt_info('can not open this file as mindmap');
            }
        });
    } else {
        prompt_info('please choose a file first');
    }
}

function select_node() {
    var nodeid = 'other';
    _jm.select_node(nodeid);
}

function show_selected() {
    var selected_node = _jm.get_selected_node();
    if (!!selected_node) {
        prompt_info(selected_node.topic);
    } else {
        prompt_info('nothing');
    }
}

function get_selected_nodeid() {
    var selected_node = _jm.get_selected_node();
    if (!!selected_node) {
        return selected_node.id;
    } else {
        return null;
    }
}

function add_node() {
    var selected_node = _jm.get_selected_node(); // as parent of new node
    if (!selected_node) {
        prompt_info('please select a node first.');
        return;
    }

    var nodeid = jsMind.util.uuid.newid();
    var topic = '* Node_' + nodeid.substr(nodeid.length - 6) + ' *';
    var node = _jm.add_node(selected_node, nodeid, topic);
}

var imageChooser = document.getElementById('image-chooser');

imageChooser.addEventListener(
    'change',
    function (event) {
        // Read file here.
        var reader = new FileReader();
        reader.onloadend = function () {
            var selected_node = _jm.get_selected_node();
            var nodeid = jsMind.util.uuid.newid();
            var topic = undefined;
            var data = {
                'background-image': reader.result,
                'width': '100',
                'height': '100',
            };
            var node = _jm.add_node(selected_node, nodeid, topic, data);
            //var node = _jm.add_image_node(selected_node, nodeid, reader.result, 100, 100);
            //add_image_node:function(parent_node, nodeid, image, width, height, data, idx, direction, expanded){
        };

        var file = imageChooser.files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    },
    false
);

function add_image_node() {
    var selected_node = _jm.get_selected_node(); // as parent of new node
    if (!selected_node) {
        prompt_info('please select a node first.');
        return;
    }

    imageChooser.focus();
    imageChooser.click();
}

function modify_node() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    // modify the topic
    _jm.update_node(selected_id, '--- modified ---');
}

function move_to_first() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.move_node(selected_id, '_first_');
}

function move_to_last() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.move_node(selected_id, '_last_');
}

function move_node() {
    // move a node before another
    _jm.move_node('other', 'open');
}

function remove_node() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.remove_node(selected_id);
}

function change_text_font() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.set_node_font_style(selected_id, 28);
}

function change_text_color() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.set_node_color(selected_id, null, '#000');
}

function change_background_color() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.set_node_color(selected_id, '#eee', null);
}

function change_background_image() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.set_node_background_image(selected_id, 'ant.png', 100, 100);
}

function set_theme(theme_name) {
    _jm.set_theme(theme_name);
}

var zoomInButton = document.getElementById('zoom-in-button');
var zoomOutButton = document.getElementById('zoom-out-button');

function zoomIn() {
    if (_jm.view.zoom_in()) {
        zoomOutButton.disabled = false;
    } else {
        zoomInButton.disabled = true;
    }
}

function zoomOut() {
    if (_jm.view.zoom_out()) {
        zoomInButton.disabled = false;
    } else {
        zoomOutButton.disabled = true;
    }
}

function toggle_editable(btn) {
    var editable = _jm.get_editable();
    if (editable) {
        _jm.disable_edit();
        btn.innerHTML = 'enable editable';
    } else {
        _jm.enable_edit();
        btn.innerHTML = 'disable editable';
    }
}

// this method change size of container, perpare for adjusting jsmind
function change_container() {
    var c = document.getElementById('jsmind_container');
    c.style.width = '800px';
    c.style.height = '500px';
}

function resize_jsmind() {
    _jm.resize();
}

function expand() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.expand_node(selected_id);
}

function collapse() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.collapse_node(selected_id);
}

function toggle() {
    var selected_id = get_selected_nodeid();
    if (!selected_id) {
        prompt_info('please select a node first.');
        return;
    }

    _jm.toggle_node(selected_id);
}

function expand_all() {
    _jm.expand_all();
}

function expand_to_level2() {
    _jm.expand_to_depth(2);
}

function expand_to_level3() {
    _jm.expand_to_depth(3);
}

function collapse_all() {
    _jm.collapse_all();
}

function get_nodearray_data() {
    var mind_data = _jm.get_data('node_array');
    var mind_string = jsMind.util.json.json2string(mind_data);
    prompt_info(mind_string);
}

function save_nodearray_file() {
    var mind_data = _jm.get_data('node_array');
    var mind_name = mind_data.meta.name;
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str, 'text/jsmind', mind_name + '.jm');
}

function open_nodearray() {
    var file_input = document.getElementById('file_input_nodearray');
    var files = file_input.files;
    if (files.length > 0) {
        var file_data = files[0];
        jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
            var mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                _jm.show(mind);
            } else {
                prompt_info('can not open this file as mindmap');
            }
        });
    } else {
        prompt_info('please choose a file first');
    }
}

function get_freemind_data() {
    var mind_data = _jm.get_data('freemind');
    var mind_string = jsMind.util.json.json2string(mind_data);
    alert(mind_string);
}

function save_freemind_file() {
    var mind_data = _jm.get_data('freemind');
    var mind_name = mind_data.meta.name || 'freemind';
    var mind_str = mind_data.data;
    jsMind.util.file.save(mind_str, 'text/xml', mind_name + '.mm');
}

function open_freemind() {
    var file_input = document.getElementById('file_input_freemind');
    var files = file_input.files;
    if (files.length > 0) {
        var file_data = files[0];
        jsMind.util.file.read(file_data, function (freemind_data, freemind_name) {
            if (freemind_data) {
                var mind_name = freemind_name;
                if (/.*\.mm$/.test(mind_name)) {
                    mind_name = freemind_name.substring(0, freemind_name.length - 3);
                }
                var mind = {
                    meta: {
                        name: mind_name,
                        author: 'hizzgdev@163.com',
                        version: '1.0.1',
                    },
                    format: 'freemind',
                    data: freemind_data,
                };
                _jm.show(mind);
            } else {
                prompt_info('can not open this file as mindmap');
            }
        });
    } else {
        prompt_info('please choose a file first');
    }
}

function prompt_info(msg) {
    alert(msg);
}

// 多行编辑控制函数
function toggle_multiline(btn) {
    var current_multiline = _jm.options.enable_multiline;
    
    if (current_multiline) {
        // 当前已启用多行，切换为禁用
        _jm.options.enable_multiline = false;
        btn.innerHTML = '启用多行编辑';
        
        // 重新渲染节点以应用新的渲染模式
        refresh_all_nodes();
        
        prompt_info('已禁用多行编辑，当前为普通单行编辑模式（使用input元素）\n\n注意：新的编辑模式将在下次编辑节点时生效');
    } else {
        // 当前未启用多行，切换为启用
        _jm.options.enable_multiline = true;
        btn.innerHTML = '禁用多行编辑';
        
        // 重新渲染节点以应用新的渲染模式
        refresh_all_nodes();
        
        prompt_info('已启用多行编辑（使用contenteditable div，Ctrl+Enter完成编辑）\n\n注意：新的编辑模式将在下次编辑节点时生效');
    }
}

// 刷新所有节点的显示以应用新的渲染模式
function refresh_all_nodes() {
    if (!_jm || !_jm.mind || !_jm.mind.nodes) {
        return;
    }
    
    // 遍历所有节点并重新渲染
    var nodes = _jm.mind.nodes;
    for (var nodeid in nodes) {
        var node = nodes[nodeid];
        if (node && node._data && node._data.view && node._data.view.element && node.topic) {
            // 重新渲染节点内容
            _jm.view.render_node(node._data.view.element, node);
        }
    }
    
    // 重新计算布局和显示
    _jm.layout.layout();
    _jm.view.show(false);
}

function show_current_mode() {
    var is_multiline = _jm.options.enable_multiline;
    
    var mode_description = is_multiline 
        ? '多行编辑模式（contenteditable div，支持换行）'
        : '普通编辑模式（input元素，单行文本）';
    
    var status_msg = `当前文本编辑模式：${is_multiline ? '多行编辑' : '单行编辑'}\n` +
                    `模式描述：${mode_description}\n\n` +
                    `提示：双击节点即可体验当前编辑模式\n` +
                    `快捷键：多行模式下，Ctrl+Enter完成编辑`;
    
    prompt_info(status_msg);
}

