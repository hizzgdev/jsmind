# jsMind 支持的选项

jsMind 提供了多种选项来定制思维导图的行为和外观。

## 通用选项

| 选项名       | 数据类型 | 默认值       | 说明                                             | 详情                                      |
| ------------ | -------- | ------------ | ------------------------------------------------ | ----------------------------------------- |
| container    | string   | ''           | [必填] 容器的 ID                                 | [详情](option.container.md)       |
| editable     | bool     | false        | 是否启用编辑                                     | [详情](option.editable.md)        |
| log_level    | string   | 'info'       | 日志级别                                         | [详情](option.log_level.md)       |
| mode         | string   | 'full'       | 布局模式                                         | [详情](option.mode.md)            |
| support_html | bool     | true         | 是否支持节点中的 HTML 元素                       | [详情](option.support_html.md)    |
| theme        | string   | null         | 主题                                             | [详情](option.theme.md)           |

## 视图选项

| 选项名                    | 数据类型 | 默认值       | 说明                                             | 详情                                      |
| ------------------------- | -------- | ------------ | ------------------------------------------------ | ----------------------------------------- |
| custom_line_render        | function | null         | 自定义线条渲染方法（从 0.8.4 版本开始支持）       | [详情](option.view.custom_line_render.md) |
| custom_node_render        | function | null         | 自定义节点渲染方法（从 0.7.6 版本开始支持）       | [详情](option.view.custom_node_render.md) |
| draggable                 | bool     | false        | 是否允许拖动画布                                 | [详情](option.view.draggable.md)          |
| enable_device_pixel_ratio | bool     | false        | 根据设备像素比渲染高清思维导图（从 0.8.5 版本开始支持） | [详情](option.view.enable_device_pixel_ratio.md) |
| engine                    | string   | 'canvas'     | 节点之间线条的渲染引擎                           | [详情](option.view.engine.md)             |
| expander_style            | string   | 'char'       | 子节点展开器的样式（从 0.7.8 版本开始支持）       | [详情](option.view.expander_style.md)     |
| hide_scrollbars_when_draggable | bool | false        | 当 draggable 为 true 时是否隐藏滚动条            | [详情](option.view.hide_scrollbars_when_draggable.md) |
| hmargin                   | number   | 容器的宽度     | 思维导图距容器外框的最小水平距离（像素）             | [详情](option.view.hmargin.vmargin.md)            |
| line_color                | string   | '#555'       | 线条颜色                                         | [详情](option.view.line_color.md)         |
| line_style                | string   | 'curved'     | 线条样式，直线或曲线                             | [详情](option.view.line_style.md)         |
| line_width                | number   | 2            | 线条宽度                                         | [详情](option.view.line_width.md)         |
| node_overflow             | string   | 'hidden'     | 节点文本过长时的样式（从 0.5.3 版本开始支持）     | [详情](option.view.node_overflow.md)      |
| vmargin                   | number   | 容器的高度     | 思维导图距容器外框的最小垂直距离（像素）           | [详情](option.view.hmargin.vmargin.md)            |
| zoom                      | object   | `{min: 0.5, max: 2.1, step: 0.1}` | 缩放配置（从 0.6.3 版本开始支持） | [详情](option.view.zoom.md)               |

## 布局选项

| 选项名       | 数据类型 | 默认值       | 说明                                             | 详情                                      |
| ------------ | -------- | ------------ | ------------------------------------------------ | ----------------------------------------- |
| cousin_space | number   | 0            | 相邻节点子节点之间的额外垂直空间（从 0.5.5 版本开始支持） | [详情](option.layout.cousin_space.md)    |
| hspace       | number   | 30           | 节点之间的水平空间                               | [详情](option.layout.hspace.md)           |
| pspace       | number   | 13           | 节点与连接线之间的水平空间                       | [详情](option.layout.pspace.md)           |
| vspace       | number   | 20           | 节点之间的垂直空间                               | [详情](option.layout.vspace.md)           |

## 快捷键选项

| 选项名       | 数据类型 | 默认值       | 说明                                             | 详情                                      |
| ------------ | -------- | ------------ | ------------------------------------------------ | ----------------------------------------- |
| enable       | bool     | true         | 是否启用快捷键                                   | [详情](option.shortcut.enable.md)         |
| handles      | object   | `{}`           | 命名的快捷键事件处理程序                         | [详情](option.shortcut.handles.md)        |
| mapping      | object   | `{addchild: [45, 4096 + 13], addbrother: 13, editnode: 113, delnode: 46, toggle: 32, left: 37, up: 38, right: 39, down: 40}` | 快捷键映射 | [详情](option.shortcut.mapping.md) |

## 插件选项

| 选项名       | 数据类型 | 默认值       | 说明                                             | 详情                                      |
| ------------ | -------- | ------------ | ------------------------------------------------ | ----------------------------------------- |
| plugin       | object   | `{}`           | 插件的选项                                       | [详情](option.plugin.plugin.md)           |

## 默认选项代码

```javascript
options = {
    container: '', // [必填] 容器的 ID
    editable: false, // 是否启用编辑
    theme: null, // 主题
    mode: 'full', // 布局模式
    support_html: true, // 是否支持节点中的 HTML 元素
    log_level: 'info', // 日志级别
    view: {
        engine: 'canvas', // 节点之间线条的渲染引擎
        hmargin: 100, // 容器的最小水平距离
        vmargin: 50, // 容器的最小垂直距离
        line_width: 2, // 线条宽度
        line_color: '#555', // 线条颜色
        line_style: 'curved', // 线条样式，直线或曲线
        custom_line_render: null, // 自定义线条渲染方法
        draggable: false, // 是否允许拖动画布
        hide_scrollbars_when_draggable: false, // 当 draggable 为 true 时是否隐藏滚动条
        node_overflow: 'hidden', // 节点文本过长时的样式
        enable_device_pixel_ratio: false, // 根据设备像素比渲染高清思维导图
        expander_style: 'char', // 子节点展开器的样式
        zoom: { // 缩放配置
            min: 0.5, // 最小缩放比例
            max: 2.1, // 最大缩放比例
            step: 0.1, // 缩放比例步长
        },
        custom_node_render: null, // 自定义节点渲染方法
    },
    layout: {
        hspace: 30, // 节点之间的水平空间
        vspace: 20, // 节点之间的垂直空间
        pspace: 13, // 节点与连接线之间的水平空间
        cousin_space: 0, // 相邻节点子节点之间的额外垂直空间
    },
    shortcut: {
        enable: true, // 是否启用快捷键
        handles: {}, // 命名的快捷键事件处理程序
        mapping: { // 快捷键映射
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            addbrother: 13, // <Enter>
            editnode: 113, // <F2>
            delnode: 46, // <Delete>
            toggle: 32, // <Space>
            left: 37, // <Left>
            up: 38, // <Up>
            right: 39, // <Right>
            down: 40, // <Down>
        }
    },
    plugin: {}, // 插件的选项
};
```