export class DataProvider {
    /**
     * Data provider: loads and serializes mind data by format.
     * @param {import('./jsmind.js').default} jm - jsMind instance
     */
    constructor(jm: import("./jsmind.js").default);
    jm: import("./jsmind.js").default;
    /** Initialize data provider. */
    init(): void;
    /** Reset data provider state. */
    reset(): void;
    /**
     * Load a Mind from mixed source.
     * @param {any} mind_data - object with {format,data} or a format-specific payload
     * @returns {import('./jsmind.mind.js').Mind|null}
     */
    load(mind_data: any): import("./jsmind.mind.js").Mind | null;
    /**
     * Serialize current mind to target format.
     * @param {'node_tree'|'node_array'|'freemind'|'text'} data_format
     * @returns {any}
     */
    get_data(data_format: "node_tree" | "node_array" | "freemind" | "text"): any;
}
