# theme Option

**theme** : (string) Theme

## Usage

The `theme` option is used to specify the theme name for jsMind. By setting different themes, you can change the overall appearance of the mind map.

## Built-in Themes

jsMind provides 15 themes:

- primary
- warning
- danger
- success
- info
- greensea
- nephrite
- belizehole
- wisteria
- asphalt
- orange
- pumpkin
- pomegranate
- clouds
- asbestos

You can visit the [feature examples](http://hizzgdev.github.io/jsmind/example/2_features.html) page to view these themes.

## Configuration Example

Below is a configuration example that includes the `theme` option:

```javascript
var options = {
    container: 'jsmind_container', // Container ID
    theme: 'primary', // Theme
};
```

In the above example, the `theme` option is set to `primary`, which uses the default primary theme.

## Custom Themes

In addition to using the default themes, you can also add your own custom themes. The style definitions can be added in the `jsmind.css` file or any other stylesheet. Simply add the style definitions in the following format:

```css
/* greensea theme */                                                      /* greensea is the theme name */
jmnodes.theme-greensea jmnode{background-color:#1abc9c;color:#fff;}       /* node style */
jmnodes.theme-greensea jmnode:hover{background-color:#16a085;}            /* node style on hover */
jmnodes.theme-greensea jmnode.selected{background-color:#11f;color:#fff;} /* selected node style */
jmnodes.theme-greensea jmnode.root{}                                      /* root node style */
jmnodes.theme-greensea jmexpander{}                                       /* expander style */
jmnodes.theme-greensea jmexpander:hover{}                                 /* expander style on hover */
```