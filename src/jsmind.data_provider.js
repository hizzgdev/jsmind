/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { logger } from './jsmind.common.js';
import { format } from './jsmind.format.js';

export class DataProvider {
    constructor(jm) {
        this.jm = jm;
    }

    init() {
        logger.debug('data.init');
    }
    reset() {
        logger.debug('data.reset');
    }
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
