# layout.cousin_space Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| layout.cousin_space | number | 0 | Extra vertical space between adjacent nodes' children (Since 0.5.5) |

## Option Description

The `cousin_space` option is used to set the extra vertical spacing between the child nodes of adjacent nodes. This option is supported in version 0.5.5 and above, with a default value of zero, meaning no extra spacing is added.

## Usage Example

Below is an example of setting the `cousin_space` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        cousin_space: 10 // Set extra vertical spacing between the child nodes of adjacent nodes to 10 pixels
    }
};
```

In the above example, the `cousin_space` option is set to `10`, which means there will be an extra 10 pixels of vertical spacing between the child nodes of adjacent nodes.

| cousin_space = 0 (default) | cousin_space = 10 | cousin_space = 50 |
| --- | --- | --- |
| <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/dfff9a11-87aa-4e14-ae27-1f1a2c42b5d5"> | <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/934f2c5c-10d5-4d32-94ad-7da7de04242e"> | <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/cad19844-1f6a-4bd9-bf68-fb295d51d88e"> |