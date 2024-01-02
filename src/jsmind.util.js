/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';

export const util = {
    file: {
        read: function (file_data, fn_callback) {
            var reader = new FileReader();
            reader.onload = function () {
                if (typeof fn_callback === 'function') {
                    fn_callback(this.result, file_data.name);
                }
            };
            reader.readAsText(file_data);
        },

        save: function (file_data, type, name) {
            var blob;
            if (typeof $.w.Blob === 'function') {
                blob = new Blob([file_data], { type: type });
            } else {
                var BlobBuilder =
                    $.w.BlobBuilder ||
                    $.w.MozBlobBuilder ||
                    $.w.WebKitBlobBuilder ||
                    $.w.MSBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(file_data);
                blob = bb.getBlob(type);
            }
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, name);
            } else {
                var URL = $.w.URL || $.w.webkitURL;
                var blob_url = URL.createObjectURL(blob);
                var anchor = $.c('a');
                if ('download' in anchor) {
                    anchor.style.visibility = 'hidden';
                    anchor.href = blob_url;
                    anchor.download = name;
                    $.d.body.appendChild(anchor);
                    var evt = $.d.createEvent('MouseEvents');
                    evt.initEvent('click', true, true);
                    anchor.dispatchEvent(evt);
                    $.d.body.removeChild(anchor);
                } else {
                    location.href = blob_url;
                }
            }
        },
    },

    json: {
        json2string: function (json) {
            return JSON.stringify(json);
        },
        string2json: function (json_str) {
            return JSON.parse(json_str);
        },
        merge: function (b, a) {
            for (var o in a) {
                if (o in b) {
                    if (
                        typeof b[o] === 'object' &&
                        Object.prototype.toString.call(b[o]).toLowerCase() == '[object object]' &&
                        !b[o].length
                    ) {
                        util.json.merge(b[o], a[o]);
                    } else {
                        b[o] = a[o];
                    }
                } else {
                    b[o] = a[o];
                }
            }
            return b;
        },
    },

    uuid: {
        newid: function () {
            return (
                new Date().getTime().toString(16) + Math.random().toString(16).substring(2)
            ).substring(2, 18);
        },
    },

    text: {
        is_empty: function (s) {
            if (!s) {
                return true;
            }
            return s.replace(/\s*/, '').length == 0;
        },
    },
};
