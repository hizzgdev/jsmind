// Aggregated public typings entry: re-export generated types without compatibility layer
export { default } from './jsmind';

// Legacy named exports back-compat: re-export classes and key option/data types if present
export { Node } from './jsmind.node';
export { Mind } from './jsmind.mind';

// Export user-facing options type - now with proper optional fields
export type { JsMindRuntimeOptions as JsMindOptions } from './jsmind.option';
export type {
    MindMapMeta,
    NodeTreeData,
    NodeTreeFormat,
    NodeArrayItem,
    NodeArrayFormat,
} from './jsmind.format';

// Static singletons / enums passthrough
export { Direction as direction, EventType as event_type } from './jsmind.common';
export { $ } from './jsmind.dom';
export { util } from './jsmind.util';

// Plugin export paths remain under subpath exports
// typings for subpath are referenced from package.json exports.types
