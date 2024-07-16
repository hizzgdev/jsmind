# container Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| container | string |  | [Required] ID of the container |

## Usage

When instantiating a jsMind instance, the `container` parameter is mandatory. jsMind uses this parameter to locate the page element and render the mind map within it.

### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
    };
    var mind = new jsMind(options);
</script>
```

### Considerations

- **Container Element**: jsMind will not perform any operations on the container, including styles and behaviors. You can style this element, but it is generally limited to setting its size, position, border, etc. If you want to change the font, font size, background color, foreground color, etc., of the mind map, it is recommended to do so by adding a custom theme.

## Container Size

It is recommended to design an appropriate size for the container to ensure that the mind map can be displayed correctly. It is advisable to use block elements (such as `<div>`) as the container to better control the size and position of the mind map. If you need to dynamically adjust the size of the container, you should call the `resize` API after adjusting the size to resize the mind map.

### Example Code

```html
<div id="jsmind_container" style="width: 800px; height: 500px;"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // Dynamically adjust size
    function resizeMindMap() {
        var container = document.getElementById('jsmind_container');
        container.style.width = '1000px';
        container.style.height = '600px';
        mind.resize();
    }
</script>
```

## Impact of Async-DOM on jsMind

jsMind uses a synchronous model, so the `container` must be added to the DOM before jsMind can be used properly. If the `container` element is not added to the DOM when jsMind is instantiated, jsMind will not be able to find the element and render the mind map.

When using frameworks like React, Angular, and Vue, special attention should be paid to this point to ensure that the `container` element is correctly added to the DOM before jsMind is instantiated.