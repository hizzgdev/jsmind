export class ShortcutProvider {
    constructor(jm: any, options: any);
    jm: any;
    opts: any;
    mapping: any;
    handles: any;
    _newid: any;
    _mapping: {};
    init(): void;
    enable_shortcut(): void;
    disable_shortcut(): void;
    handler(e: any): boolean;
    handle_addchild(_jm: any, e: any): void;
    handle_addbrother(_jm: any, e: any): void;
    handle_editnode(_jm: any, e: any): void;
    handle_delnode(_jm: any, e: any): void;
    handle_toggle(_jm: any, e: any): void;
    handle_up(_jm: any, e: any): void;
    handle_down(_jm: any, e: any): void;
    handle_left(_jm: any, e: any): void;
    handle_right(_jm: any, e: any): void;
    _handle_direction(_jm: any, e: any, d: any): void;
}
