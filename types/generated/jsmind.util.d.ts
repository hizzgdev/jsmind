/**
 * Misc utility collection.
 * @type {{
 *  file: { read: (file: File, cb:(result:string,name:string)=>void)=>void, save:(data:string,type:string,name:string)=>void},
 *  json: { json2string:(v:unknown)=>string, string2json:(s:string)=>unknown, merge:(b:object,a:object)=>object },
 *  uuid: { newid:()=>string },
 *  text: { is_empty:(s?:string)=>boolean }
 * }}
 */
export const util: {
    file: {
        read: (file: File, cb: (result: string, name: string) => void) => void;
        save: (data: string, type: string, name: string) => void;
    };
    json: {
        json2string: (v: unknown) => string;
        string2json: (s: string) => unknown;
        merge: (b: object, a: object) => object;
    };
    uuid: {
        newid: () => string;
    };
    text: {
        is_empty: (s?: string) => boolean;
    };
};
