# pspace Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| pspace | number | 13 | Horizontal space between nodes and connection lines |

## Option Description

The `pspace` option is used to set the horizontal spacing between nodes and connecting lines to accommodate the node collapse/expand controller. The default value for this option is 13 pixels.

## Usage Example

Below is an example of setting the `pspace` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        pspace: 20 // Set horizontal spacing between nodes and connecting lines to 20 pixels
    }
};
```

In the above example, the `pspace` option is set to `20`, which means the horizontal spacing between nodes and connecting lines will be 20 pixels.

## Related Options and Settings

- **jmexpander**: Custom theme styles for the node collapse/expand controller. For example, the `jmexpander` styles in the `greensea` theme are defined as follows:

```css
/* greensea theme */
.jmnodes.theme-greensea .jmexpander {
    width: 18px;
    height: 18px;
    border-radius: 9px;
    font-size: 18px;
}
.jmnodes.theme-greensea .jmexpander:hover { /* 鼠标悬停展开/关闭节点的控制点样式 */ }
```

## Preview

| pspace = 13 (default) | pspace = 20 (applied custom theme) |
| --- | --- |
| <img width="397" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/bf0bf558-f8e6-4f05-b71d-e030883af90b"> | <img width="414" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a29ece77-ee69-49fe-ae9a-aa6c6f663fcc"> |
