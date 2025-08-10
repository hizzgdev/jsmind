export class DataProvider {
    constructor(jm: any);
    jm: any;
    init(): void;
    reset(): void;
    load(mind_data: any): import("./jsmind.mind.js").Mind;
    get_data(data_format: any): {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: {
            id: any;
            topic: any;
            expanded: boolean;
        };
    } | {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any[];
    } | {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: string;
    };
}
