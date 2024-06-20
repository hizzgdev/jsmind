# log_level Option

**log_level** : (string) Log level

## Usage

The `log_level` option is used to control the log output level of jsMind. Different log levels can help developers obtain varying degrees of detailed log information during debugging and development. jsMind provides five log levels:

- `debug`: Outputs all log information, including debug information. This is the most detailed log level and is suitable for development and debugging stages.
- `info`: Outputs general information logs. This is the default log level and is suitable for most cases.
- `warn`: Outputs warning information logs. This is suitable for situations that need attention but do not affect the program's operation.
- `error`: Outputs error information logs. This is suitable for situations where errors occur during the program's operation.
- `disable`: Disables all log outputs. This is suitable for cases where no log information is needed.

### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        log_level: 'debug', // Set log level to debug
    };
    var mind = new jsMind(options);
</script>
```

### Notes

- **Debugging Stage**: During development and debugging stages, it is recommended to set `log_level` to `debug` to obtain the most detailed log information, which helps in quickly locating and solving problems.
- **Production Environment**: In a production environment, it is recommended to set `log_level` to `info` or higher levels (such as `warn` or `error`) to reduce the amount of log output and improve performance.
- **Disabling Logs**: If no log information is needed, you can set `log_level` to `disable`, which will completely disable log output.
