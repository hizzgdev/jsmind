# expander_style Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| expander_style | string | 'char' | Style of the child node expander (Since 0.7.8) |

## Option Description

The `view.expander_style` option is used to set the style of the child node expander controller. This option supports the following two styles:

- `char` - Displays `-` and `+` on the expander controller to indicate the node's expansion state. This is the default value.
- `number` - Displays the number of child nodes on the expander controller. If the number of child nodes exceeds 99, it will display `...`.

This option is supported in jsMind version 0.7.8 and above.

## Usage Example

Below is an example of setting the `view.expander_style` option to `number`:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        expander_style: 'number', // Display the number of child nodes
    }
};
```

In the example above, the `view.expander_style` option is set to `number`, which means the expander controller will display the number of child nodes. If the number of child nodes exceeds 99, it will display `...`.

| 'char' | 'number' |
| --- | --- |
| <img width="469" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/8462da63-3c1f-4858-9f66-e088670115e2"> | <img width="396" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/e309e397-dbf5-424d-a0be-32ab99a902d2"> |


## Additional Content

If you need to customize the style of the expander controller, you can add the corresponding style definitions in a custom CSS file. For example:

```css
/* Custom expander controller style */
.jmnodes .jmexpander {
    background-color: #f0f0f0;
    color: #333;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

The above CSS code defines a circular expander controller and sets the background color and text color. You can further adjust the style as needed. For more detailed information, please refer to the [theme Option](option.theme.md).