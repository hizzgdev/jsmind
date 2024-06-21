# draggable Option

**view.draggable** : (bool) Whether to allow dragging the canvas instead of using the mouse scroll when the container cannot fully accommodate the mind map

## Option Description

When the mind map cannot be fully displayed within the container, scroll bars will appear by default. Enabling this option allows users to view different parts of the mind map by dragging the canvas. The default value for this parameter is `false` (this feature is disabled).

## Usage Example

Below is an example of enabling the `draggable` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'canvas',
        draggable: true, // Enable canvas dragging
        hide_scrollbars_when_draggable: true // Hide scroll bars when dragging is enabled
    }
};
```

In the above example, the `draggable` option is set to `true`, which means users can view different parts of the mind map by dragging the canvas. Additionally, the `hide_scrollbars_when_draggable` option is set to `true`, which will hide the scrollbars.

## Notes

- The `draggable` option only takes effect when the mind map cannot be fully displayed within the container.
- When the `draggable` option is `true`, you can control whether to hide the scroll bars by setting the `hide_scrollbars_when_draggable` option.
- It is not recommended to enable this option on touch screen devices, as dragging on a touch screen essentially equates to dragging the scroll bars.