/**
 * Misc utility collection.
 * @type {{
 *  file: { read: (file: File, cb:(result:string,name:string)=>void)=>void, save:(data:string,type:string,name:string)=>void},
 *  json: { json2string:(v:any)=>string, string2json:(s:string)=>any, merge:(b:any,a:any)=>any },
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
        json2string: (v: any) => string;
        string2json: (s: string) => any;
        merge: (b: any, a: any) => any;
    };
    uuid: {
        newid: () => string;
    };
    text: {
        is_empty: (s?: string) => boolean;
    };
};
