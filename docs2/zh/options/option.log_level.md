# log_level 选项

**log_level** : (string) 日志级别

## 用法

`log_level` 选项用于控制 jsMind 的日志输出级别。不同的日志级别可以帮助开发者在调试和开发过程中获取不同详细程度的日志信息。jsMind 提供了五种日志级别：

- `debug`：输出所有日志信息，包括调试信息。这是最详细的日志级别，适用于开发和调试阶段。
- `info`：输出一般信息日志。这是默认的日志级别，适用于大多数情况。
- `warn`：输出警告信息日志。适用于需要关注但不影响程序运行的情况。
- `error`：输出错误信息日志。适用于程序运行中出现的错误情况。
- `disable`：禁用所有日志输出。适用于不需要任何日志信息的情况。

### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        log_level: 'debug', // 设置日志级别为 debug
    };
    var mind = new jsMind(options);
</script>
```

### 注意事项

- **调试阶段**：在开发和调试阶段，建议将 `log_level` 设置为 `debug`，以便获取最详细的日志信息，帮助快速定位和解决问题。
- **生产环境**：在生产环境中，建议将 `log_level` 设置为 `info` 或更高的级别（如 `warn` 或 `error`），以减少日志输出量，提升性能。
- **禁用日志**：如果不需要任何日志信息，可以将 `log_level` 设置为 `disable`，这将完全禁用日志输出。
