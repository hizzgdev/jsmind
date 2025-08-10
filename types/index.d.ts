// Aggregated public typings entry: re-export generated types without compatibility layer
export { default } from './generated/jsmind';

// Legacy named exports back-compat: re-export classes and key option/data types if present
export { Node } from './generated/jsmind.node';
export { Mind } from './generated/jsmind.mind';

// Export strict options and meta types from generated
export type { JsMindRuntimeOptions as JsMindOptions } from './generated/jsmind.option';
export type {
    MindMapMeta,
    NodeTreeData,
    NodeTreeFormat,
    NodeArrayItem,
    NodeArrayFormat,
} from './generated/jsmind.format';

// Static singletons / enums passthrough
export { Direction as direction, EventType as event_type } from './generated/jsmind.common';
export { $ } from './generated/jsmind.dom';
export { util } from './generated/jsmind.util';

// Plugin export paths remain under subpath exports
// typings for subpath are referenced from package.json exports.types
