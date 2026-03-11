# Multiline Text Plugin

The Multiline Text Plugin provides complete multiline text support for jsMind, including display and editing capabilities.

## Features

- ✅ **Multiline Text Display**: Display multiline text in nodes
- ✅ **Multiline Text Editing**: Rich text editor using `contentEditable`
- ✅ **Auto Word Wrap**: Automatic line wrapping when text exceeds maximum width
- ✅ **Auto Height Expansion**: Editor height automatically adjusts to content
- ✅ **Keyboard Shortcuts**:
  - `Shift + Enter`: Insert line break
  - `Enter`: Save changes
  - `Esc`: Cancel editing
  - `Tab`: Save changes
- ✅ **Text Normalization**: Automatically trim whitespace, normalize line endings, limit consecutive blank lines

## Installation

### Method 1: UMD (Browser)

```html
<script src="es6/jsmind.js"></script>
<script src="es6/jsmind.multiline-text.js"></script>
```

### Method 2: ES6 Module

```javascript
import jsMind from './es6/jsmind.js';
import { createMultilineRender } from './es6/jsmind.multiline-text.js';
```

## Usage

### Basic Usage

```javascript
// UMD (Browser)
const options = {
    container: 'jsmind_container',
    editable: true,
    view: {
        // Use the custom render function provided by the plugin
        custom_node_render: jsMindMultilineText.createMultilineRender({
            text_width: 200,
            line_height: '1.5',
        })
    },
    plugin: {
        multiline_text: {
            text_width: 200,
            line_height: '1.5',
        }
    }
};

const jm = new jsMind(options);
jm.show(mind_data);
```

### ES6 Module Usage

```javascript
import jsMind from './es6/jsmind.js';
import { createMultilineRender } from './es6/jsmind.multiline-text.js';

const options = {
    container: 'jsmind_container',
    editable: true,
    view: {
        custom_node_render: createMultilineRender({
            text_width: 200,
            line_height: '1.5',
        })
    },
    plugin: {
        multiline_text: {
            text_width: 200,
            line_height: '1.5',
        }
    }
};

const jm = new jsMind(options);
jm.show(mind_data);
```

## Configuration Options

### `createMultilineRender(options)`

Create a custom node render function for multiline text.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text_width` | `number` | `200` | Maximum width for multiline text nodes (px) |
| `line_height` | `string` | `'1.5'` | Line height for text |

**Returns:** `function(jsMind, HTMLElement, Node): boolean`

**Example:**

```javascript
const customRender = createMultilineRender({
    text_width: 250,
    line_height: '1.6',
});
```

### Plugin Options

Configure the plugin behavior in `options.plugin.multiline_text`:

```javascript
{
    plugin: {
        multiline_text: {
            text_width: 200,      // Maximum width for multiline text
            line_height: '1.5',   // Line height
        }
    }
}
```

## How It Works

### 1. Node Rendering

The plugin provides a custom render function that:

1. Detects if node topic contains newline characters (`\n`)
2. If yes, applies multiline styles:
   - `white-space: pre-wrap` - Preserve line breaks and spaces
   - `word-break: break-word` - Break long words
   - `max-width: {text_width}px` - Limit maximum width
3. If no, uses default rendering

### 2. Node Editing

When editing a node, the plugin:

1. Creates a `<div contenteditable="plaintext-only">` editor
2. Sets editor styles to match the node element:
   - Width = node width
   - Min-height = node height
   - Auto-expands height based on content
3. Handles keyboard events:
   - `Shift + Enter`: Insert line break
   - `Enter`: Save changes
   - `Esc`: Cancel editing
   - `Tab`: Save changes
4. Auto-expands height on input
5. Saves changes on blur (with 100ms delay)

### 3. Text Normalization

When saving, the plugin normalizes the text:

```javascript
const topic = (editor.textContent || '')
    .trim()                      // Remove leading/trailing whitespace
    .replace(/\r\n/g, '\n')      // Normalize Windows line endings
    .replace(/\r/g, '\n')        // Normalize Mac line endings
    .replace(/\n{3,}/g, '\n\n'); // Limit consecutive blank lines to 2
```

## Examples

### Example 1: Basic Multiline Text

```javascript
const mind = {
    meta: { name: 'Demo', author: 'jsMind', version: '1.0' },
    format: 'node_tree',
    data: {
        id: 'root',
        topic: 'Multiline Text\nMind Map',
        children: [
            {
                id: 'node1',
                topic: 'Line 1\nLine 2\nLine 3',
            },
        ],
    },
};

jm.show(mind);
```

### Example 2: Programmatically Add Multiline Node

```javascript
// Add a multiline child node
jm.add_node(
    'parent_node_id',
    'new_node_id',
    'First line\nSecond line\nThird line'
);
```

### Example 3: Update Node to Multiline

```javascript
// Update existing node to multiline text
jm.update_node('node_id', 'New line 1\nNew line 2');
```

## Editor Behavior

### Auto Height Expansion

The editor automatically expands its height based on content:

```javascript
const autoExpand = () => {
    editor.style.height = 'auto';
    editor.style.height = editor.scrollHeight + 'px';
};
$.on(editor, 'input', autoExpand);
setTimeout(autoExpand, 0);  // Initial expand
```

**Behavior:**
- Initial height = node height
- Expands when content exceeds initial height
- Shrinks when content is deleted (but not below initial height)
- No scrollbar (overflow: hidden)

### Editor Styles

```css
.jsmind-multiline-editor {
    width: {node.clientWidth}px;
    min-height: {node.clientHeight}px;
    line-height: {opts.line_height};
    border: none;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    overflow: hidden;
}
```

## API Reference

### `createMultilineRender(options)`

Create a custom node render function.

**Type:**
```typescript
function createMultilineRender(options?: {
    text_width?: number;
    line_height?: string;
}): (jm: jsMind, element: HTMLElement, node: Node) => boolean
```

**Example:**
```javascript
const render = createMultilineRender({
    text_width: 250,
    line_height: '1.6',
});
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

**Note:** Requires `contenteditable="plaintext-only"` support.

## Troubleshooting

### Issue: Plugin not working

**Solution:**
1. Make sure the plugin script is loaded after jsMind core
2. Check that `custom_node_render` is set in options
3. Check that `plugin.multiline_text` is configured
4. Open browser console and look for `[Multiline Plugin] Initializing...`

### Issue: Editor not showing

**Solution:**
1. Check that the node is editable (`options.editable = true`)
2. Check browser console for errors
3. Verify that `contenteditable` is supported in your browser

### Issue: Height not expanding

**Solution:**
1. Check that `overflow: hidden` is set on the editor
2. Verify that the `input` event is firing
3. Check browser console for JavaScript errors

## License

BSD-3-Clause

## Author

UmbraCi

## Links

- [GitHub Repository](https://github.com/hizzgdev/jsmind/)
- [Documentation](https://hizzgdev.github.io/jsmind/)

