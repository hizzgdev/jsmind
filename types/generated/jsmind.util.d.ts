export namespace util {
    namespace file {
        function read(file_data: any, fn_callback: any): void;
        function save(file_data: any, type: any, name: any): void;
    }
    namespace json {
        function json2string(json: any): string;
        function string2json(json_str: any): any;
        function merge(b: any, a: any): any;
    }
    namespace uuid {
        function newid(): string;
    }
    namespace text {
        function is_empty(s: any): boolean;
    }
}
