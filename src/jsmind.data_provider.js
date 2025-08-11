/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { logger } from './jsmind.common.js';
import { format } from './jsmind.format.js';

export class DataProvider {
    /**
     * Data provider: loads and serializes mind data by format.
     * @param {import('./jsmind.js').default} jm - jsMind instance
     */
    constructor(jm) {
        this.jm = jm;
    }

    /** Initialize data provider. */
    init() {
        logger.debug('data.init');
    }
    /** Reset data provider state. */
    reset() {
        logger.debug('data.reset');
    }
    /**
     * Load a Mind from mixed source.
     * @param {import('./jsmind.format.js').NodeTreeFormat|import('./jsmind.format.js').NodeArrayFormat|{meta?:{name:string,author:string,version:string},format:'freemind',data:string}|{meta?:{name:string,author:string,version:string},format:'text',data:string}} mind_data - object with {format,data} or a format-specific payload
     * @returns {import('./jsmind.mind.js').Mind|null}
     */
    load(mind_data) {
        var df = null;
        var mind = null;
        if (typeof mind_data === 'object') {
            if (!!mind_data.format) {
                df = mind_data.format;
            } else {
                df = 'node_tree';
            }
        } else {
            df = 'freemind';
        }

        if (df == 'node_array') {
            mind = format.node_array.get_mind(mind_data);
        } else if (df == 'node_tree') {
            mind = format.node_tree.get_mind(mind_data);
        } else if (df == 'freemind') {
            mind = format.freemind.get_mind(mind_data);
        } else if (df == 'text') {
            mind = format.text.get_mind(mind_data);
        } else {
            logger.warn('unsupported format');
        }
        return mind;
    }
    /**
     * Serialize current mind to target format.
     * @param {'node_tree'|'node_array'|'freemind'|'text'} data_format
     * @returns {import('./jsmind.format.js').NodeTreeFormat|import('./jsmind.format.js').NodeArrayFormat|{meta:{name:string,author:string,version:string},format:'freemind',data:string}|{meta:{name:string,author:string,version:string},format:'text',data:string}}
     */
    get_data(data_format) {
        var data = null;
        if (data_format == 'node_array') {
            data = format.node_array.get_data(this.jm.mind);
        } else if (data_format == 'node_tree') {
            data = format.node_tree.get_data(this.jm.mind);
        } else if (data_format == 'freemind') {
            data = format.freemind.get_data(this.jm.mind);
        } else if (data_format == 'text') {
            data = format.text.get_data(this.jm.mind);
        } else {
            logger.error('unsupported ' + data_format + ' format');
        }
        return data;
    }
}
