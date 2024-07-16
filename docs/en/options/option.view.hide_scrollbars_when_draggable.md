# view.hide_scrollbars_when_draggable Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| view.hide_scrollbars_when_draggable | bool | false | Whether to hide scrollbars when draggable is true |

## Option Description

The `view.hide_scrollbars_when_draggable` option is used to set whether to hide the scrollbars inside the container when the [`view.draggable`](option.view.draggable.md) option is `true`. The default value of this option is `false`, meaning the scrollbars are shown. When set to `true`, the scrollbars inside the container will be hidden, and users will not be able to use the mouse wheel to scroll through different parts of the mind map.

## Usage Example

Below is an example of setting the `view.hide_scrollbars_when_draggable` option to `true`:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        draggable: true, // Allow dragging the canvas
        hide_scrollbars_when_draggable: true, // Hide scrollbars
    }
};
```

In the example above, the `view.draggable` option is set to `true`, allowing users to view different parts of the mind map by dragging the canvas. At the same time, the `view.hide_scrollbars_when_draggable` option is set to `true`, hiding the scrollbars inside the container.